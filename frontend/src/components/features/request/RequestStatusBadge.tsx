import { RequestStatus } from '@/lib/api/api.type';
import { cn } from '@/lib/utils';

const STATUS_STYLE: Record<RequestStatus, { label: string; className: string }> =
  {
    PENDING: {
      label: 'รอพิจารณา',
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
    },
    APPROVED: {
      label: 'อนุมัติแล้ว',
      className:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
    },
    REJECTED: {
      label: 'ถูกปฏิเสธ',
      className: 'bg-destructive/15 text-destructive'
    },
    CANCELLED: {
      label: 'ยกเลิกแล้ว',
      className: 'bg-muted text-muted-foreground'
    }
  };

export default function RequestStatusBadge({
  status
}: {
  status: RequestStatus;
}) {
  const { label, className } = STATUS_STYLE[status];

  return (
    <span
      className={cn(
        'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
        className
      )}
    >
      {label}
    </span>
  );
}
