'use client';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { approveRequestAction } from '@/lib/actions/request.action';
import { RequestResponse } from '@/lib/api/api.type';
import { AlertCircle, Check } from 'lucide-react';
import { useState, useTransition } from 'react';

type ApproveRequestDialogProps = {
  request: RequestResponse;
};

export default function ApproveRequestDialog({
  request
}: ApproveRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const stockAfter = request.asset.stockQty - request.quantity;
  const isStockEnough = stockAfter >= 0;

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveRequestAction(request.id);

      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }

      setOpen(false);
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(current) => {
        setOpen(current);
        if (!current) {
          setErrorMessage(null);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm" data-slot="dialog-trigger">
            <Check className="size-4" />
            อนุมัติ
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ยืนยันการอนุมัติคำขอ</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {errorMessage && (
            <Alert
              variant="destructive"
              className="bg-destructive/15 border-destructive"
            >
              <AlertCircle />
              <AlertTitle>{errorMessage}</AlertTitle>
            </Alert>
          )}

          <div className="rounded-lg border bg-muted/40 p-3 text-sm">
            <p>
              ผู้ขอ: <span className="font-semibold">{request.user.name}</span>
            </p>
            <p>
              อุปกรณ์:{' '}
              <span className="font-semibold">{request.asset.name}</span>{' '}
              จำนวน {request.quantity} ชิ้น
            </p>
            <p className="text-muted-foreground">เหตุผล: {request.reason}</p>
          </div>

          {isStockEnough && (
            <p className="text-sm">
              เมื่ออนุมัติแล้ว ระบบจะตัดจำนวนคงคลังทันที:{' '}
              <span className="font-semibold tabular-nums">
                {request.asset.stockQty} → {stockAfter}
              </span>
            </p>
          )}

          {!isStockEnough && (
            <Alert
              variant="destructive"
              className="bg-destructive/15 border-destructive"
            >
              <AlertCircle />
              <AlertTitle>
                จำนวนคงคลังไม่พอ (มี {request.asset.stockQty} แต่ขอ{' '}
                {request.quantity})
              </AlertTitle>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isPending || !isStockEnough}
          >
            {isPending ? 'กำลังอนุมัติ...' : 'ยืนยันอนุมัติ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
