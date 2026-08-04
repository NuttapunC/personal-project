'use server';

import z from 'zod';
import { revalidatePath } from 'next/cache';
import { ActionResult } from './action.type';
import { CategoryApi } from '../api/category.api';
import { ApiError } from '../api/api-error';
import { CategoryInput, categorySchema } from '../schemas/category.schema';

const CATEGORY_PAGE = '/admin/categories';
const DUPLICATE_NAME_MESSAGE = 'ชื่อหมวดหมู่นี้ถูกใช้แล้ว';
const CATEGORY_IN_USE_MESSAGE = 'ลบไม่ได้ เพราะยังมีอุปกรณ์ใช้หมวดหมู่นี้อยู่';

export async function createCategoryAction(
  input: CategoryInput
): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: z.flattenError(parsed.error),
      code: 'VALIDATION_ERROR'
    };
  }

  try {
    await CategoryApi.createCategory(parsed.data);
  } catch (error) {
    return toActionError(error, DUPLICATE_NAME_MESSAGE);
  }

  revalidatePath(CATEGORY_PAGE);
  return { success: true };
}

export async function updateCategoryAction(
  id: string,
  input: CategoryInput
): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: z.flattenError(parsed.error),
      code: 'VALIDATION_ERROR'
    };
  }

  try {
    await CategoryApi.updateCategory(id, parsed.data);
  } catch (error) {
    return toActionError(error, DUPLICATE_NAME_MESSAGE);
  }

  revalidatePath(CATEGORY_PAGE);
  return { success: true };
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    await CategoryApi.deleteCategory(id);
  } catch (error) {
    return toActionError(error, CATEGORY_IN_USE_MESSAGE);
  }

  revalidatePath(CATEGORY_PAGE);
  return { success: true };
}

// แปลง error จาก API เป็นข้อความภาษาไทยให้ผู้ใช้อ่านเข้าใจ
// conflictMessage ต่างกันตามการกระทำ: เพิ่ม/แก้ไข = ชื่อซ้ำ, ลบ = ยังมีอุปกรณ์ใช้อยู่
function toActionError(error: unknown, conflictMessage: string): ActionResult {
  if (error instanceof ApiError) {
    if (error.statusCode === 409) {
      return { success: false, message: conflictMessage, code: 'CONFLICT' };
    }

    if (error.statusCode === 404) {
      return {
        success: false,
        message: 'ไม่พบหมวดหมู่นี้ (อาจถูกลบไปแล้ว)',
        code: 'NOT_FOUND'
      };
    }

    if (error.statusCode === 403) {
      return {
        success: false,
        message: 'คุณไม่มีสิทธิ์ทำรายการนี้',
        code: 'FORBIDDEN'
      };
    }

    return { success: false, message: error.message, code: 'API_ERROR' };
  }

  throw error;
}
