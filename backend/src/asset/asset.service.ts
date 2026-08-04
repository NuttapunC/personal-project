import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { Role } from '@/database/generated/prisma/enums';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { QueryAssetDto } from './dto/query-asset.dto';
import { AssetResponseDto, PaginatedAssetsDto } from './dto/asset-response.dto';
import { AssetWhereInput } from '@/database/generated/prisma/models/Asset';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// ส่ง category ติดไปด้วยเสมอ เพื่อให้หน้าเว็บแสดงชื่อหมวดหมู่ได้โดยไม่ต้องยิง API ซ้ำ
const INCLUDE_CATEGORY = {
  category: { select: { id: true, name: true } }
};

@Injectable()
export class AssetService {
  constructor(private readonly prisma: PrismaService) {}

  async getAssets(
    query: QueryAssetDto,
    role: Role
  ): Promise<PaginatedAssetsDto> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;

    const where: AssetWhereInput = {};

    // ผู้ใช้ทั่วไปเห็นเฉพาะอุปกรณ์ที่เปิดใช้งาน ส่วน Admin เห็นทั้งหมดรวมที่ลบแล้ว
    if (role !== Role.ADMIN) {
      where.isActive = true;
    }

    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    const [data, total] = await Promise.all([
      this.prisma.asset.findMany({
        where,
        include: INCLUDE_CATEGORY,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.asset.count({ where })
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

  async createAsset(dto: CreateAssetDto): Promise<AssetResponseDto> {
    await this.ensureCategoryExists(dto.categoryId);

    return this.prisma.asset.create({
      data: dto,
      include: INCLUDE_CATEGORY
    });
  }

  async updateAsset(
    id: string,
    dto: UpdateAssetDto
  ): Promise<AssetResponseDto> {
    await this.getAssetOrThrow(id);

    if (dto.categoryId) {
      await this.ensureCategoryExists(dto.categoryId);
    }

    return this.prisma.asset.update({
      where: { id },
      data: dto,
      include: INCLUDE_CATEGORY
    });
  }

  // Soft Delete (BR-04): ไม่ลบแถวจริง เพื่อให้คำขอเบิกในอดีตยังอ้างอิงอุปกรณ์ได้
  async deleteAsset(id: string): Promise<void> {
    await this.getAssetOrThrow(id);

    await this.prisma.asset.update({
      where: { id },
      data: { isActive: false }
    });
  }

  private async getAssetOrThrow(id: string) {
    const asset = await this.prisma.asset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
    return asset;
  }

  private async ensureCategoryExists(categoryId: string): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId }
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
  }
}
