import { cn } from '@/lib/utils';
import Link from 'next/link';

type StatCardProps = {
  label: string;
  value: number;
  unit: string;
  hint?: string;
  href?: string;
  highlight?: boolean;
};

export default function StatCard({
  label,
  value,
  unit,
  hint,
  href,
  highlight
}: StatCardProps) {
  const content = (
    <div
      className={cn(
        'rounded-lg border bg-card p-4 transition-colors',
        href && 'hover:border-primary',
        highlight && value > 0 && 'border-primary/50 bg-primary/5'
      )}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums">
        {value}
        <span className="ml-1 text-base font-normal text-muted-foreground">
          {unit}
        </span>
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
