import CreateRequestDialog from '@/components/features/request/CreateRequestDialog';
import { AssetResponse, CategoryResponse } from '@/lib/api/api.type';
import { cn } from '@/lib/utils';
import AssetFormDialog from './AssetFormDialog';
import DeleteAssetDialog from './DeleteAssetDialog';

type AssetTableProps = {
  assets: AssetResponse[];
  // ส่ง categories มาด้วย = โหมดแอดมิน (มีปุ่มแก้ไข/ลบ)
  categories?: CategoryResponse[];
  // โหมดพนักงาน: แสดงปุ่มสร้างคำขอเบิก
  canRequest?: boolean;
};

export default function AssetTable({
  assets,
  categories,
  canRequest
}: AssetTableProps) {
  const isAdminMode = Boolean(categories);

  if (assets.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        ไม่พบอุปกรณ์
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-3 text-left font-medium">ชื่ออุปกรณ์</th>
            <th className="p-3 text-left font-medium">หมวดหมู่</th>
            <th className="p-3 text-right font-medium">คงคลัง</th>
            {isAdminMode && (
              <>
                <th className="p-3 text-center font-medium">สถานะ</th>
                <th className="p-3 text-right font-medium">จัดการ</th>
              </>
            )}
            {canRequest && <th className="p-3 text-right font-medium">เบิก</th>}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b last:border-b-0">
              <td className="p-3 font-medium">{asset.name}</td>
              <td className="p-3 text-muted-foreground">
                {asset.category.name}
              </td>
              <td
                className={cn(
                  'p-3 text-right tabular-nums',
                  asset.stockQty === 0 && 'text-destructive font-semibold'
                )}
              >
                {asset.stockQty}
              </td>
              {isAdminMode && (
                <>
                  <td className="p-3 text-center">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs',
                        asset.isActive
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {asset.isActive ? 'ใช้งาน' : 'ถูกลบแล้ว'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <AssetFormDialog
                        categories={categories!}
                        asset={asset}
                      />
                      {asset.isActive && <DeleteAssetDialog asset={asset} />}
                    </div>
                  </td>
                </>
              )}
              {canRequest && (
                <td className="p-3">
                  <div className="flex justify-end">
                    <CreateRequestDialog asset={asset} />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
