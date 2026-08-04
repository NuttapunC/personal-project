import { CategoryResponse } from '@/lib/api/api.type';
import CategoryFormDialog from './CategoryFormDialog';
import DeleteCategoryDialog from './DeleteCategoryDialog';

type CategoryTableProps = {
  categories: CategoryResponse[];
};

export default function CategoryTable({ categories }: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        ยังไม่มีหมวดหมู่ — กดปุ่ม &quot;เพิ่มหมวดหมู่&quot; เพื่อสร้างรายการแรก
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-3 text-left font-medium">ชื่อหมวดหมู่</th>
            <th className="p-3 text-left font-medium">คำอธิบาย</th>
            <th className="p-3 text-right font-medium">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b last:border-b-0">
              <td className="p-3 font-medium">{category.name}</td>
              <td className="p-3 text-muted-foreground">
                {category.description ?? '—'}
              </td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <CategoryFormDialog category={category} />
                  <DeleteCategoryDialog category={category} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
