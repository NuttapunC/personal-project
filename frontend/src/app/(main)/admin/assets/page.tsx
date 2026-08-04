import AssetFilterBar from '@/components/features/asset/AssetFilterBar';
import AssetFormDialog from '@/components/features/asset/AssetFormDialog';
import AssetTable from '@/components/features/asset/AssetTable';
import Pagination from '@/components/shared/Pagination';
import { AssetApi } from '@/lib/api/asset.api';
import { CategoryApi } from '@/lib/api/category.api';
import { parsePage, parseUuid } from '@/lib/query-params';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'จัดการอุปกรณ์'
};

type AdminAssetsPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
  }>;
};

export default async function AdminAssetsPage({
  searchParams
}: AdminAssetsPageProps) {
  const params = await searchParams;

  const [assets, categories] = await Promise.all([
    AssetApi.getAssets({
      page: parsePage(params.page),
      search: params.search,
      categoryId: parseUuid(params.categoryId)
    }),
    CategoryApi.getCategories()
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">จัดการอุปกรณ์</h1>
          <p className="text-sm text-muted-foreground">
            ทั้งหมด {assets.meta.total} รายการ (รวมที่ถูกลบแล้ว)
          </p>
        </div>
        <AssetFormDialog categories={categories} />
      </div>

      <AssetFilterBar categories={categories} />
      <AssetTable assets={assets.data} categories={categories} />
      <Pagination
        meta={assets.meta}
        basePath="/admin/assets"
        params={params}
      />
    </div>
  );
}
