'use server';

import z from 'zod';
import { revalidatePath } from 'next/cache';
import { ActionResult } from './action.type';
import { AssetApi } from '../api/asset.api';
import { ApiError } from '../api/api-error';
import { AssetInput, assetSchema } from '../schemas/asset.schema';

const ADMIN_ASSET_PAGE = '/admin/assets';
const USER_ASSET_PAGE = '/assets';

export async function createAssetAction(
  input: AssetInput
): Promise<ActionResult> {
  const parsed = assetSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: z.flattenError(parsed.error),
      code: 'VALIDATION_ERROR'
    };
  }

  try {
    await AssetApi.createAsset(parsed.data);
  } catch (error) {
    return toActionError(error);
  }

  revalidateAssetPages();
  return { success: true };
}

export async function updateAssetAction(
  id: string,
  input: AssetInput
): Promise<ActionResult> {
  const parsed = assetSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: z.flattenError(parsed.error),
      code: 'VALIDATION_ERROR'
    };
  }

  try {
    await AssetApi.updateAsset(id, parsed.data);
  } catch (error) {
    return toActionError(error);
  }

  revalidateAssetPages();
  return { success: true };
}

export async function deleteAssetAction(id: string): Promise<ActionResult> {
  try {
    await AssetApi.deleteAsset(id);
  } catch (error) {
    return toActionError(error);
  }

  revalidateAssetPages();
  return { success: true };
}

// อุปกรณ์แสดงอยู่ 2 หน้า (ฝั่งแอดมินและฝั่งพนักงาน) ต้องรีเฟรชทั้งคู่
function revalidateAssetPages(): void {
  revalidatePath(ADMIN_ASSET_PAGE);
  revalidatePath(USER_ASSET_PAGE);
}

// แปลง error จาก API เป็นข้อความภาษาไทยให้ผู้ใช้อ่านเข้าใจ
function toActionError(error: unknown): ActionResult {
  if (error instanceof ApiError) {
    if (error.statusCode === 400) {
      return {
        success: false,
        message: 'ข้อมูลไม่ถูกต้อง (ตรวจหมวดหมู่และจำนวนคงคลังอีกครั้ง)',
        code: 'BAD_REQUEST'
      };
    }

    if (error.statusCode === 404) {
      return {
        success: false,
        message: 'ไม่พบอุปกรณ์นี้ (อาจถูกลบไปแล้ว)',
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
