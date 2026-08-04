export class AssetCategoryDto {
  id: string;

  name: string;
}

export class AssetResponseDto {
  id: string;

  name: string;

  categoryId: string;

  category: AssetCategoryDto;

  stockQty: number;

  isActive: boolean;

  createdAt: Date;
}

export class PaginationMetaDto {
  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

export class PaginatedAssetsDto {
  data: AssetResponseDto[];

  meta: PaginationMetaDto;
}
