import { RequestStatus } from '@/database/generated/prisma/enums';

export class RequestAssetDto {
  id: string;

  name: string;

  stockQty: number;
}

export class RequestUserDto {
  id: string;

  name: string;

  email: string;
}

export class RequestResponseDto {
  id: string;

  userId: string;

  user: RequestUserDto;

  assetId: string;

  asset: RequestAssetDto;

  quantity: number;

  reason: string;

  status: RequestStatus;

  adminNote: string | null;

  decidedById: string | null;

  decidedAt: Date | null;

  createdAt: Date;
}

export class PaginatedRequestsDto {
  data: RequestResponseDto[];

  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
