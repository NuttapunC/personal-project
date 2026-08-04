export class LowStockAssetDto {
  id: string;

  name: string;

  stockQty: number;
}

export class TopRequestedAssetDto {
  assetId: string;

  name: string;

  // จำนวนรวมที่ถูกอนุมัติให้เบิกไปแล้ว
  totalApproved: number;
}

export class DashboardStatsDto {
  pendingCount: number;

  approvedThisMonth: number;

  lowStockAssets: LowStockAssetDto[];

  topRequested: TopRequestedAssetDto[];
}
