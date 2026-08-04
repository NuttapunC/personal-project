'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

/**
 * เก็บค่าค้นหา/ตัวกรองไว้ใน URL (refresh หรือแชร์ลิงก์แล้วผลเหมือนเดิม)
 * ทุกครั้งที่เปลี่ยนตัวกรอง จะรีเซ็ตกลับไปหน้า 1 เสมอ
 */
export function useQueryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const getParam = useCallback(
    (key: string) => searchParams.get(key) ?? '',
    [searchParams]
  );

  return { setParam, getParam };
}
