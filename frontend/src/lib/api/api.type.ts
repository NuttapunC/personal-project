export type Role = 'USER' | 'ADMIN';

export type UserResponse = {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
};

export type LoginResponse = {
  access_token: string;
  user: UserResponse;
};

export type MessageResponse = {
  message: string;
};

export type CategoryResponse = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
};

export type AssetResponse = {
  id: string;
  name: string;
  categoryId: string;
  category: { id: string; name: string };
  stockQty: number;
  isActive: boolean;
  createdAt: string;
};

export type RequestStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export type RequestResponse = {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string };
  assetId: string;
  asset: { id: string; name: string; stockQty: number };
  quantity: number;
  reason: string;
  status: RequestStatus;
  adminNote: string | null;
  decidedById: string | null;
  decidedAt: string | null;
  createdAt: string;
};

export type DashboardStats = {
  pendingCount: number;
  approvedThisMonth: number;
  lowStockAssets: { id: string; name: string; stockQty: number }[];
  topRequested: { assetId: string; name: string; totalApproved: number }[];
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};
