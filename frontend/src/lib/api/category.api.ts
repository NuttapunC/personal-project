import { CategoryResponse, MessageResponse } from './api.type';
import { authFetch } from './auth-fetch';

export type CategoryInput = {
  name: string;
  description?: string;
};

export const CategoryApi = {
  async getCategories() {
    return authFetch<CategoryResponse[]>('/categories', {
      cache: 'no-store'
    });
  },

  async createCategory(data: CategoryInput) {
    return authFetch<CategoryResponse>('/categories', {
      method: 'POST',
      body: data
    });
  },

  async updateCategory(id: string, data: CategoryInput) {
    return authFetch<CategoryResponse>(`/categories/${id}`, {
      method: 'PATCH',
      body: data
    });
  },

  async deleteCategory(id: string) {
    return authFetch<MessageResponse>(`/categories/${id}`, {
      method: 'DELETE'
    });
  }
};
