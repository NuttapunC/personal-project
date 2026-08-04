import { RequestResponse } from '@/lib/api/api.type';
import ApproveRequestDialog from './ApproveRequestDialog';
import RejectRequestDialog from './RejectRequestDialog';
import RequestStatusBadge from './RequestStatusBadge';

type AdminRequestTableProps = {
  requests: RequestResponse[];
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function AdminRequestTable({
  requests
}: AdminRequestTableProps) {
  if (requests.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        ไม่มีคำขอเบิก
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-3 text-left font-medium">ผู้ขอ</th>
            <th className="p-3 text-left font-medium">อุปกรณ์</th>
            <th className="p-3 text-right font-medium">ขอ</th>
            <th className="p-3 text-right font-medium">คงคลัง</th>
            <th className="p-3 text-left font-medium">เหตุผล</th>
            <th className="p-3 text-center font-medium">สถานะ</th>
            <th className="p-3 text-right font-medium">พิจารณา</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b last:border-b-0">
              <td className="p-3">
                <p className="font-medium">{request.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(request.createdAt)}
                </p>
              </td>
              <td className="p-3 font-medium">{request.asset.name}</td>
              <td className="p-3 text-right tabular-nums">
                {request.quantity}
              </td>
              <td className="p-3 text-right tabular-nums text-muted-foreground">
                {request.asset.stockQty}
              </td>
              <td className="p-3 text-muted-foreground">
                {request.reason}
                {request.status === 'REJECTED' && request.adminNote && (
                  <p className="mt-1 text-destructive">
                    เหตุผลที่ปฏิเสธ: {request.adminNote}
                  </p>
                )}
              </td>
              <td className="p-3 text-center">
                <RequestStatusBadge status={request.status} />
                {/* Decision Log: บันทึกว่าตัดสินใจเมื่อไหร่ (FR-APR-04) */}
                {request.decidedAt && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDateTime(request.decidedAt)}
                  </p>
                )}
              </td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  {/* ตัดสินใจได้เฉพาะคำขอที่ยังรอพิจารณา (BR-01) */}
                  {request.status === 'PENDING' && (
                    <>
                      <ApproveRequestDialog request={request} />
                      <RejectRequestDialog request={request} />
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
