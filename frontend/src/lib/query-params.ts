import { RequestStatus } from './api/api.type';

const REQUEST_STATUSES: RequestStatus[] = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELLED'
];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * ค่าจาก URL แก้ไขได้อิสระ ถ้าส่งค่าที่ไม่ถูกต้องไปให้ API จะได้ 400 แล้วหน้าเว็บพัง
 * จึงกรองทิ้งตั้งแต่ต้น ให้ถือว่า "ไม่ได้กรอง" แทนการแสดง error
 */
export function parseRequestStatus(
  value?: string
): RequestStatus | undefined {
  return REQUEST_STATUSES.includes(value as RequestStatus)
    ? (value as RequestStatus)
    : undefined;
}

export function parseUuid(value?: string): string | undefined {
  return value && UUID_PATTERN.test(value) ? value : undefined;
}

export function parsePage(value?: string): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
