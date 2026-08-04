import { UserResponse } from './api.type';
import { authFetch } from './auth-fetch';

export const UserApi = {
  // ใช้เป็นตัวเลือกตัวกรอง "ผู้ขอ" ในหน้าคำขอฝั่งแอดมิน (แอดมินเท่านั้น)
  async getUsers() {
    return authFetch<UserResponse[]>('/users', { cache: 'no-store' });
  }
};
