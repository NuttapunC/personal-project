import {
  Paginated,
  RequestResponse,
  RequestStatus
} from './api.type';
import { authFetch } from './auth-fetch';

export type RequestQuery = {
  status?: RequestStatus;
  userId?: string;
  page?: number;
  limit?: number;
};

export type RequestInput = {
  assetId: string;
  quantity: number;
  reason: string;
};

function toQueryString(query: RequestQuery): string {
  const params = new URLSearchParams();
  if (query.status) params.set('status', query.status);
  if (query.userId) params.set('userId', query.userId);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export const RequestApi = {
  // คำขอของตัวเอง (พนักงาน)
  async getMyRequests(query: RequestQuery = {}) {
    return authFetch<Paginated<RequestResponse>>(
      `/requests/me${toQueryString(query)}`,
      { cache: 'no-store' }
    );
  },

  // คำขอของทุกคน (แอดมิน)
  async getAllRequests(query: RequestQuery = {}) {
    return authFetch<Paginated<RequestResponse>>(
      `/requests${toQueryString(query)}`,
      { cache: 'no-store' }
    );
  },

  async createRequest(data: RequestInput) {
    return authFetch<RequestResponse>('/requests', {
      method: 'POST',
      body: data
    });
  },

  async cancelRequest(id: string) {
    return authFetch<RequestResponse>(`/requests/${id}/cancel`, {
      method: 'PATCH'
    });
  },

  async approveRequest(id: string) {
    return authFetch<RequestResponse>(`/requests/${id}/approve`, {
      method: 'PATCH'
    });
  },

  async rejectRequest(id: string, adminNote: string) {
    return authFetch<RequestResponse>(`/requests/${id}/reject`, {
      method: 'PATCH',
      body: { adminNote }
    });
  }
};
