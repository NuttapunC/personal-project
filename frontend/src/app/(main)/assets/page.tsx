import AssetFilterBar from '@/components/features/asset/AssetFilterBar';
import AssetTable from '@/components/features/asset/AssetTable';
import Pagination from '@/components/shared/Pagination';
import { AssetApi } from '@/lib/api/asset.api';
import { CategoryApi } from '@/lib/api/category.api';
import { parsePage, parseUuid } from '@/lib/query-params';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'รายการอุปกรณ์'
};

type AssetsPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
  }>;
};

export default async function AssetsPage({ searchParams }: AssetsPageProps) {
  const params = await searchParams;

  const categoryId = parseUuid(params.categoryId);

  const [assets, categories] = await Promise.all([
    AssetApi.getAssets({
      page: parsePage(params.page),
      search: params.search,
      categoryId
    }),
    CategoryApi.getCategories()
  ]);

  const isFiltering = Boolean(params.search || categoryId);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">รายการอุปกรณ์</h1>
        <p className="text-sm text-muted-foreground">
          {isFiltering
            ? `พบ ${assets.meta.total} รายการตามเงื่อนไขที่ค้นหา`
            : `อุปกรณ์ที่เปิดให้เบิก ${assets.meta.total} รายการ`}
        </p>
      </div>

      <AssetFilterBar categories={categories} />
      <AssetTable assets={assets.data} canRequest />
      <Pagination meta={assets.meta} basePath="/assets" params={params} />
    </div>
  );
}
