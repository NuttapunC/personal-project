'use server';

import z from 'zod';
import { revalidatePath } from 'next/cache';
import { ActionResult } from './action.type';
import { RequestApi } from '../api/request.api';
import { ApiError } from '../api/api-error';
import { RequestInput, requestSchema } from '../schemas/request.schema';
import { rejectSchema } from '../schemas/decision.schema';

const MY_REQUESTS_PAGE = '/requests';
const ASSETS_PAGE = '/assets';
const ADMIN_REQUESTS_PAGE = '/admin/requests';
const ADMIN_ASSETS_PAGE = '/admin/assets';

export async function createRequestAction(
  input: RequestInput
): Promise<ActionResult> {
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: z.flattenError(parsed.error),
      code: 'VALIDATION_ERROR'
    };
  }

  try {
    await RequestApi.createRequest(parsed.data);
  } catch (error) {
    return toActionError(error, 'จำนวนที่ขอเกินจำนวนคงคลัง หรืออุปกรณ์ไม่พร้อมให้เบิก');
  }

  revalidatePath(MY_REQUESTS_PAGE);
  revalidatePath(ASSETS_PAGE);
  return { success: true };
}

export async function cancelRequestAction(id: string): Promise<ActionResult> {
  try {
    await RequestApi.cancelRequest(id);
  } catch (error) {
    return toActionError(error, 'ยกเลิกได้เฉพาะคำขอที่ยังรอพิจารณาเท่านั้น');
  }

  revalidatePath(MY_REQUESTS_PAGE);
  return { success: true };
}

export async function approveRequestAction(
  id: string
): Promise<ActionResult> {
  try {
    await RequestApi.approveRequest(id);
  } catch (error) {
    return toActionError(
      error,
      'อนุมัติไม่ได้ — จำนวนคงคลังไม่พอ หรือคำขอถูกตัดสินไปแล้ว'
    );
  }

  revalidateDecisionPages();
  return { success: true };
}

export async function rejectRequestAction(
  id: string,
  adminNote: string
): Promise<ActionResult> {
  const parsed = rejectSchema.safeParse({ adminNote });
  if (!parsed.success) {
    return {
      success: false,
      message: 'กรุณากรอกเหตุผลที่ปฏิเสธ',
      errors: z.flattenError(parsed.error),
      code: 'VALIDATION_ERROR'
    };
  }

  try {
    await RequestApi.rejectRequest(id, parsed.data.adminNote);
  } catch (error) {
    return toActionError(error, 'ปฏิเสธไม่ได้ — คำขอนี้ถูกตัดสินไปแล้ว');
  }

  revalidateDecisionPages();
  return { success: true };
}

// การอนุมัติกระทบทั้งรายการคำขอและจำนวนคงคลัง จึงต้องรีเฟรชหลายหน้า
function revalidateDecisionPages(): void {
  revalidatePath(ADMIN_REQUESTS_PAGE);
  revalidatePath(ADMIN_ASSETS_PAGE);
  revalidatePath(MY_REQUESTS_PAGE);
  revalidatePath(ASSETS_PAGE);
}

// แปลง error จาก API เป็นข้อความภาษาไทย
// badRequestMessage ต่างกันตามการกระทำ: สร้าง = จำนวนเกินสต็อก, ยกเลิก = สถานะไม่ใช่ PENDING
function toActionError(
  error: unknown,
  badRequestMessage: string
): ActionResult {
  if (error instanceof ApiError) {
    if (error.statusCode === 400) {
      return { success: false, message: badRequestMessage, code: 'BAD_REQUEST' };
    }

    if (error.statusCode === 403) {
      return {
        success: false,
        message: 'คุณจัดการได้เฉพาะคำขอของตัวเองเท่านั้น',
        code: 'FORBIDDEN'
      };
    }

    if (error.statusCode === 404) {
      return {
        success: false,
        message: 'ไม่พบคำขอนี้',
        code: 'NOT_FOUND'
      };
    }

    return { success: false, message: error.message, code: 'API_ERROR' };
  }

  throw error;
}
