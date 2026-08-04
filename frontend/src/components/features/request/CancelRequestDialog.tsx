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
import { cancelRequestAction } from '@/lib/actions/request.action';
import { RequestResponse } from '@/lib/api/api.type';
import { AlertCircle, XCircle } from 'lucide-react';
import { useState, useTransition } from 'react';

type CancelRequestDialogProps = {
  request: RequestResponse;
};

export default function CancelRequestDialog({
  request
}: CancelRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelRequestAction(request.id);

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
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            data-slot="dialog-trigger"
          >
            <XCircle className="size-4" />
            ยกเลิก
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ยืนยันการยกเลิกคำขอ</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {errorMessage && (
            <Alert
              variant="destructive"
              className="bg-destructive/15 border-destructive"
            >
              <AlertCircle />
              <AlertTitle>{errorMessage}</AlertTitle>
            </Alert>
          )}

          <p className="text-sm">
            ต้องการยกเลิกคำขอเบิก{' '}
            <span className="font-semibold">{request.asset.name}</span> จำนวน{' '}
            {request.quantity} ชิ้น ใช่หรือไม่? ยกเลิกแล้วจะกลับมาแก้ไม่ได้
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            ไม่ยกเลิก
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isPending}
          >
            {isPending ? 'กำลังยกเลิก...' : 'ยืนยันยกเลิก'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
