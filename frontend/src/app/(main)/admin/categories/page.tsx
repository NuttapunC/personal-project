import CategoryFormDialog from '@/components/features/category/CategoryFormDialog';
import CategoryTable from '@/components/features/category/CategoryTable';
import { CategoryApi } from '@/lib/api/category.api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'จัดการหมวดหมู่'
};

export default async function AdminCategoriesPage() {
  const categories = await CategoryApi.getCategories();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">จัดการหมวดหมู่</h1>
          <p className="text-sm text-muted-foreground">
            หมวดหมู่ใช้สำหรับจัดกลุ่มอุปกรณ์ ทั้งหมด {categories.length} รายการ
          </p>
        </div>
        <CategoryFormDialog />
      </div>

      <CategoryTable categories={categories} />
    </div>
  );
}
