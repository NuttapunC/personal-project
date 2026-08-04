import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { RequestStatus, Role } from '@/database/generated/prisma/enums';
import { CreateRequestDto } from './dto/create-request.dto';
import { QueryRequestDto } from './dto/query-request.dto';
import { RejectRequestDto } from './dto/reject-request.dto';
import {
  PaginatedRequestsDto,
  RequestResponseDto
} from './dto/request-response.dto';
import { RequestWhereInput } from '@/database/generated/prisma/models/Request';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// ส่งข้อมูลอุปกรณ์และผู้ขอติดไปด้วย หน้าเว็บจะได้แสดงชื่อได้เลย
const INCLUDE_RELATIONS = {
  asset: { select: { id: true, name: true, stockQty: true } },
  user: { select: { id: true, name: true, email: true } }
};

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(
    userId: string,
    dto: CreateRequestDto
  ): Promise<RequestResponseDto> {
    // เบิกได้เฉพาะอุปกรณ์ที่เปิดใช้งานอยู่
    const asset = await this.prisma.asset.findFirst({
      where: { id: dto.assetId, isActive: true }
    });
    if (!asset) {
      throw new BadRequestException('Asset is not available');
    }

    // จำนวนที่ขอต้องไม่เกินคงคลังปัจจุบัน (การตัดสต็อกจริงเกิดตอน Admin อนุมัติ)
    if (dto.quantity > asset.stockQty) {
      throw new BadRequestException(
        `Quantity exceeds available stock (${asset.stockQty})`
      );
    }

    return this.prisma.request.create({
      data: { ...dto, userId },
      include: INCLUDE_RELATIONS
    });
  }

  async getRequests(
    query: QueryRequestDto,
    // ระบุ userId = ดูเฉพาะคำขอของคนนั้น (ฝั่งพนักงาน), ไม่ระบุ = ทุกคน (ฝั่ง Admin)
    ownerId?: string
  ): Promise<PaginatedRequestsDto> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;

    const where: RequestWhereInput = {};

    if (ownerId) {
      where.userId = ownerId;
    } else if (query.userId) {
      where.userId = query.userId;
    }

    if (query.status) {
      where.status = query.status;
    }

    const [data, total] = await Promise.all([
      this.prisma.request.findMany({
        where,
        include: INCLUDE_RELATIONS,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.request.count({ where })
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getRequestById(
    id: string,
    currentUserId: string,
    role: Role
  ): Promise<RequestResponseDto> {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: INCLUDE_RELATIONS
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // พนักงานเปิดดูได้เฉพาะคำขอของตัวเอง (FR-REQ-04)
    if (role !== Role.ADMIN && request.userId !== currentUserId) {
      throw new ForbiddenException('You can only access your own request');
    }

    return request;
  }

  async cancelRequest(
    id: string,
    currentUserId: string
  ): Promise<RequestResponseDto> {
    const request = await this.prisma.request.findUnique({ where: { id } });
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.userId !== currentUserId) {
      throw new ForbiddenException('You can only cancel your own request');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only a pending request can be cancelled');
    }

    // ใส่เงื่อนไข status ใน where ด้วย กันกรณี Admin ตัดสินใจพอดีในจังหวะเดียวกัน
    const { count } = await this.prisma.request.updateMany({
      where: { id, userId: currentUserId, status: RequestStatus.PENDING },
      data: { status: RequestStatus.CANCELLED }
    });

    if (count === 0) {
      throw new BadRequestException('Only a pending request can be cancelled');
    }

    return this.prisma.request.findUniqueOrThrow({
      where: { id },
      include: INCLUDE_RELATIONS
    });
  }

  /**
   * อนุมัติคำขอ (FR-APR-02)
   * ทั้ง 3 ขั้นตอน (เช็คสถานะ → ตัดสต็อก → เปลี่ยนสถานะ) อยู่ใน Transaction เดียวกัน
   * ถ้าขั้นไหนล้มเหลว ทุกอย่างจะถูกย้อนกลับทั้งหมด
   */
  async approveRequest(
    id: string,
    adminId: string
  ): Promise<RequestResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.request.findUnique({ where: { id } });
      if (!request) {
        throw new NotFoundException('Request not found');
      }

      // คำขอที่จบแล้วเปลี่ยนสถานะอีกไม่ได้ (BR-01, BR-05)
      if (request.status !== RequestStatus.PENDING) {
        throw new BadRequestException('Only a pending request can be decided');
      }

      // ตัดสต็อกแบบมีเงื่อนไข: ตัดได้ก็ต่อเมื่อคงคลัง ณ วินาทีนั้นยังพอ (BR-02, BR-03)
      // วิธีนี้กัน Race Condition ได้ เพราะเงื่อนไขถูกตรวจในคำสั่ง UPDATE เดียวกับที่หักลบ
      const stockUpdate = await tx.asset.updateMany({
        where: { id: request.assetId, stockQty: { gte: request.quantity } },
        data: { stockQty: { decrement: request.quantity } }
      });
      if (stockUpdate.count === 0) {
        throw new BadRequestException('Insufficient stock to approve');
      }

      // เปลี่ยนสถานะแบบมีเงื่อนไขเช่นกัน กันกรณี Admin 2 คนกดอนุมัติคำขอเดียวกันพร้อมกัน
      // ถ้าอีกคนชิงเปลี่ยนสถานะไปก่อน count จะเป็น 0 แล้ว transaction นี้จะถูกย้อนกลับ
      const statusUpdate = await tx.request.updateMany({
        where: { id, status: RequestStatus.PENDING },
        data: {
          status: RequestStatus.APPROVED,
          decidedById: adminId,
          decidedAt: new Date()
        }
      });
      if (statusUpdate.count === 0) {
        throw new BadRequestException('Only a pending request can be decided');
      }

      return tx.request.findUniqueOrThrow({
        where: { id },
        include: INCLUDE_RELATIONS
      });
    });
  }

  /**
   * ปฏิเสธคำขอ (FR-APR-03) — ไม่ยุ่งกับสต็อก แต่ต้องมีเหตุผลเสมอ
   */
  async rejectRequest(
    id: string,
    adminId: string,
    dto: RejectRequestDto
  ): Promise<RequestResponseDto> {
    const request = await this.prisma.request.findUnique({ where: { id } });
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only a pending request can be decided');
    }

    const { count } = await this.prisma.request.updateMany({
      where: { id, status: RequestStatus.PENDING },
      data: {
        status: RequestStatus.REJECTED,
        adminNote: dto.adminNote,
        decidedById: adminId,
        decidedAt: new Date()
      }
    });
    if (count === 0) {
      throw new BadRequestException('Only a pending request can be decided');
    }

    return this.prisma.request.findUniqueOrThrow({
      where: { id },
      include: INCLUDE_RELATIONS
    });
  }
}
