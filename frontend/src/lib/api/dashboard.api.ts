import { DashboardStats } from './api.type';
import { authFetch } from './auth-fetch';

export const DashboardApi = {
  // ข้อมูลสรุปทั้งหมดของ Dashboard มาในครั้งเดียว (แอดมินเท่านั้น)
  async getStats() {
    return authFetch<DashboardStats>('/admin/stats', { cache: 'no-store' });
  }
};
