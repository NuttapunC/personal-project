import { AssetResponse, MessageResponse, Paginated } from './api.type';
import { authFetch } from './auth-fetch';

export type AssetQuery = {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
};

export type AssetInput = {
  name: string;
  categoryId: string;
  stockQty: number;
};

function toQueryString(query: AssetQuery): string {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.categoryId) params.set('categoryId', query.categoryId);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export const AssetApi = {
  async getAssets(query: AssetQuery = {}) {
    return authFetch<Paginated<AssetResponse>>(
      `/assets${toQueryString(query)}`,
      { cache: 'no-store' }
    );
  },

  async createAsset(data: AssetInput) {
    return authFetch<AssetResponse>('/assets', {
      method: 'POST',
      body: data
    });
  },

  async updateAsset(id: string, data: AssetInput) {
    return authFetch<AssetResponse>(`/assets/${id}`, {
      method: 'PATCH',
      body: data
    });
  },

  async deleteAsset(id: string) {
    return authFetch<MessageResponse>(`/assets/${id}`, {
      method: 'DELETE'
    });
  }
};
