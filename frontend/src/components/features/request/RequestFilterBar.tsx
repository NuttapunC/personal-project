'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RequestStatus, UserResponse } from '@/lib/api/api.type';
import { useQueryFilter } from '@/lib/hooks/useQueryFilter';

const ALL = 'ALL';

const STATUS_LABELS: Record<RequestStatus, string> = {
  PENDING: 'รอพิจารณา',
  APPROVED: 'อนุมัติแล้ว',
  REJECTED: 'ถูกปฏิเสธ',
  CANCELLED: 'ยกเลิกแล้ว'
};

type RequestFilterBarProps = {
  // ส่ง users มาด้วย = โหมดแอดมิน (มีตัวกรองผู้ขอเพิ่ม)
  users?: UserResponse[];
};

export default function RequestFilterBar({ users }: RequestFilterBarProps) {
  const { setParam, getParam } = useQueryFilter();
  const currentStatus = getParam('status');
  const currentUser = getParam('userId');

  const statusItems: Record<string, string> = {
    [ALL]: 'ทุกสถานะ',
    ...STATUS_LABELS
  };

  const userItems: Record<string, string> = {
    [ALL]: 'ผู้ขอทุกคน',
    ...Object.fromEntries((users ?? []).map((user) => [user.id, user.name]))
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Select
        items={statusItems}
        value={currentStatus || ALL}
        onValueChange={(value: string | null) =>
          setParam('status', !value || value === ALL ? null : value)
        }
      >
        <SelectTrigger className="min-w-44" aria-label="กรองตามสถานะ">
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectItem value={ALL}>ทุกสถานะ</SelectItem>
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <SelectItem key={status} value={status}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {users && (
        <Select
          items={userItems}
          value={currentUser || ALL}
          onValueChange={(value: string | null) =>
            setParam('userId', !value || value === ALL ? null : value)
          }
        >
          <SelectTrigger className="min-w-44" aria-label="กรองตามผู้ขอ">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value={ALL}>ผู้ขอทุกคน</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
