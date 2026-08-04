import { Button } from '@/components/ui/button';
import { PaginationMeta } from '@/lib/api/api.type';
import Link from 'next/link';

type PaginationProps = {
  meta: PaginationMeta;
  // path ของหน้าปัจจุบัน เช่น /assets
  basePath: string;
  // ค่าค้นหา/ตัวกรองปัจจุบัน ต้องติดไปกับลิงก์เปลี่ยนหน้าด้วย ไม่งั้นกดแล้วตัวกรองหาย
  params?: Record<string, string | undefined>;
};

export default function Pagination({ meta, basePath, params }: PaginationProps) {
  if (meta.totalPages <= 1) {
    return null;
  }

  const buildHref = (page: number) => {
    const searchParams = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value && key !== 'page') {
        searchParams.set(key, value);
      }
    });
    searchParams.set('page', String(page));
    return `${basePath}?${searchParams.toString()}`;
  };

  const hasPrevious = meta.page > 1;
  const hasNext = meta.page < meta.totalPages;

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        หน้า {meta.page} จาก {meta.totalPages} (ทั้งหมด {meta.total} รายการ)
      </p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevious}
          nativeButton={false}
          render={
            hasPrevious ? (
              <Link href={buildHref(meta.page - 1)}>ก่อนหน้า</Link>
            ) : (
              <span>ก่อนหน้า</span>
            )
          }
        />
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext}
          nativeButton={false}
          render={
            hasNext ? (
              <Link href={buildHref(meta.page + 1)}>ถัดไป</Link>
            ) : (
              <span>ถัดไป</span>
            )
          }
        />
      </div>
    </div>
  );
}
