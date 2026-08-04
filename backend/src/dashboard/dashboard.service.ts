import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { RequestStatus } from '@/database/generated/prisma/enums';
import {
  DashboardStatsDto,
  TopRequestedAssetDto
} from './dto/dashboard-stats.dto';

// อุปกรณ์ที่เหลือน้อยกว่าหรือเท่ากับจำนวนนี้ ถือว่า "ใกล้หมด"
const LOW_STOCK_THRESHOLD = 5;
const LOW_STOCK_LIMIT = 10;
const TOP_REQUESTED_LIMIT = 5;

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<DashboardStatsDto> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [pendingCount, approvedThisMonth, lowStockAssets, topRequested] =
      await Promise.all([
        this.prisma.request.count({
          where: { status: RequestStatus.PENDING }
        }),
        // นับจาก decidedAt (เวลาที่อนุมัติ) ไม่ใช่ createdAt (เวลาที่ยื่นคำขอ)
        this.prisma.request.count({
          where: {
            status: RequestStatus.APPROVED,
            decidedAt: { gte: startOfMonth }
          }
        }),
        this.prisma.asset.findMany({
          where: { isActive: true, stockQty: { lte: LOW_STOCK_THRESHOLD } },
          select: { id: true, name: true, stockQty: true },
          orderBy: { stockQty: 'asc' },
          take: LOW_STOCK_LIMIT
        }),
        this.getTopRequested()
      ]);

    return { pendingCount, approvedThisMonth, lowStockAssets, topRequested };
  }

  // อุปกรณ์ที่ถูกเบิกบ่อยที่สุด นับเฉพาะคำขอที่อนุมัติแล้ว (FR-DSH-02)
  private async getTopRequested(): Promise<TopRequestedAssetDto[]> {
    const grouped = await this.prisma.request.groupBy({
      by: ['assetId'],
      where: { status: RequestStatus.APPROVED },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: TOP_REQUESTED_LIMIT
    });

    if (grouped.length === 0) {
      return [];
    }

    // ดึงชื่ออุปกรณ์มาเติม เพราะ groupBy คืนมาแค่ assetId
    const assets = await this.prisma.asset.findMany({
      where: { id: { in: grouped.map((row) => row.assetId) } },
      select: { id: true, name: true }
    });
    const nameById = new Map(assets.map((asset) => [asset.id, asset.name]));

    return grouped.map((row) => ({
      assetId: row.assetId,
      name: nameById.get(row.assetId) ?? 'ไม่พบอุปกรณ์',
      totalApproved: row._sum.quantity ?? 0
    }));
  }
}
