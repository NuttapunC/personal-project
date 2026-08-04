import StatCard from '@/components/features/dashboard/StatCard';
import { DashboardApi } from '@/lib/api/dashboard.api';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard'
};

export default async function AdminDashboardPage() {
  const stats = await DashboardApi.getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ภาพรวมระบบ</h1>
        <p className="text-sm text-muted-foreground">
          สรุปสถานะคำขอและจำนวนคงคลัง สำหรับวางแผนจัดซื้อ
        </p>
      </div>

      {/* ตัวเลขสรุป (FR-DSH-01) */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="คำขอรอพิจารณา"
          value={stats.pendingCount}
          unit="รายการ"
          hint="กดเพื่อไปหน้าพิจารณาคำขอ"
          href="/admin/requests?status=PENDING"
          highlight
        />
        <StatCard
          label="อนุมัติในเดือนนี้"
          value={stats.approvedThisMonth}
          unit="รายการ"
          hint="นับจากวันที่ตัดสินใจอนุมัติ"
          href="/admin/requests?status=APPROVED"
        />
        <StatCard
          label="อุปกรณ์ใกล้หมด"
          value={stats.lowStockAssets.length}
          unit="รายการ"
          hint="เหลือ 5 ชิ้นหรือน้อยกว่า"
          href="/admin/assets"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* อุปกรณ์ใกล้หมดสต็อก (FR-DSH-01) */}
        <section className="space-y-2">
          <h2 className="font-semibold">อุปกรณ์ใกล้หมดสต็อก</h2>
          {stats.lowStockAssets.length === 0 ? (
            <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
              ไม่มีอุปกรณ์ที่ใกล้หมด
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border bg-card">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">ชื่ออุปกรณ์</th>
                    <th className="p-3 text-right font-medium">คงเหลือ</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockAssets.map((asset) => (
                    <tr key={asset.id} className="border-b last:border-b-0">
                      <td className="p-3">{asset.name}</td>
                      <td
                        className={cn(
                          'p-3 text-right font-semibold tabular-nums',
                          asset.stockQty === 0
                            ? 'text-destructive'
                            : 'text-amber-600 dark:text-amber-400'
                        )}
                      >
                        {asset.stockQty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* อุปกรณ์ที่ถูกเบิกบ่อยที่สุด (FR-DSH-02) */}
        <section className="space-y-2">
          <h2 className="font-semibold">อุปกรณ์ที่ถูกเบิกบ่อยที่สุด</h2>
          {stats.topRequested.length === 0 ? (
            <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
              ยังไม่มีคำขอที่อนุมัติแล้ว
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border bg-card">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">ชื่ออุปกรณ์</th>
                    <th className="p-3 text-right font-medium">
                      เบิกไปแล้วรวม
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topRequested.map((asset) => (
                    <tr key={asset.assetId} className="border-b last:border-b-0">
                      <td className="p-3">{asset.name}</td>
                      <td className="p-3 text-right tabular-nums">
                        {asset.totalApproved} ชิ้น
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
