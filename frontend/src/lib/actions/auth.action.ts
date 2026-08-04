'use server';

import z from 'zod';
import {
  LoginInput,
  SignupInput,
  signupSchema
} from '../schemas/auth.schema';
import { ErrorActionResult } from './action.type';
import { AuthApi } from '../api/auth.api';
import { ApiError } from '../api/api-error';
import { redirect } from 'next/navigation';
import { signIn, signOut } from '../auth';
import { CredentialsSignin } from 'next-auth';

export async function signupAction(
  input: SignupInput
): Promise<ErrorActionResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: z.flattenError(parsed.error),
      code: 'VALIDATION_ERROR'
    };
  }
  try {
    await AuthApi.signup(parsed.data);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode === 409) {
        return {
          success: false,
          message: 'อีเมลนี้ถูกใช้งานแล้ว',
          code: 'EMAIL_ALREADY_EXISTS'
        };
      }
    }
    throw error;
  }

  redirect('/login');
}

export async function loginAction(
  input: LoginInput
): Promise<ErrorActionResult> {
  try {
    await signIn('credentials', { ...input, redirect: false });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return {
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
        code: 'INVALID_CREDENTIALS'
      };
    }
    throw error;
  }
  redirect('/');
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: '/login' });
}
