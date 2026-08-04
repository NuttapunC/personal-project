import { RequestResponse } from '@/lib/api/api.type';
import CancelRequestDialog from './CancelRequestDialog';
import RequestStatusBadge from './RequestStatusBadge';

type MyRequestTableProps = {
  requests: RequestResponse[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export default function MyRequestTable({ requests }: MyRequestTableProps) {
  if (requests.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        ยังไม่มีคำขอเบิก — ไปที่หน้ารายการอุปกรณ์เพื่อสร้างคำขอแรกของคุณ
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-3 text-left font-medium">อุปกรณ์</th>
            <th className="p-3 text-right font-medium">จำนวน</th>
            <th className="p-3 text-left font-medium">เหตุผล</th>
            <th className="p-3 text-left font-medium">วันที่ขอ</th>
            <th className="p-3 text-center font-medium">สถานะ</th>
            <th className="p-3 text-right font-medium">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b last:border-b-0">
              <td className="p-3 font-medium">{request.asset.name}</td>
              <td className="p-3 text-right tabular-nums">
                {request.quantity}
              </td>
              <td className="p-3 text-muted-foreground">
                {request.reason}
                {/* เหตุผลที่ถูกปฏิเสธจากผู้ดูแล (FR-REQ-02) */}
                {request.status === 'REJECTED' && request.adminNote && (
                  <p className="mt-1 text-destructive">
                    เหตุผลที่ถูกปฏิเสธ: {request.adminNote}
                  </p>
                )}
              </td>
              <td className="p-3 whitespace-nowrap text-muted-foreground">
                {formatDate(request.createdAt)}
              </td>
              <td className="p-3 text-center">
                <RequestStatusBadge status={request.status} />
              </td>
              <td className="p-3">
                <div className="flex justify-end">
                  {/* ยกเลิกได้เฉพาะคำขอที่ยังรอพิจารณา (FR-REQ-03) */}
                  {request.status === 'PENDING' && (
                    <CancelRequestDialog request={request} />
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
