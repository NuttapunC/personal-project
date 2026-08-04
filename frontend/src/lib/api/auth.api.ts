import { LoginInput, SignupInput } from '../schemas/auth.schema';
import { apiFetch } from './api-fetch';
import { LoginResponse } from './api.type';

export const AuthApi = {
  signup(data: SignupInput) {
    return apiFetch<void>('/auth/signup', {
      method: 'POST',
      body: data
    });
  },

  login(data: LoginInput) {
    return apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: data
    });
  }
};
