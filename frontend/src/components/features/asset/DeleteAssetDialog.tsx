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
import { deleteAssetAction } from '@/lib/actions/asset.action';
import { AssetResponse } from '@/lib/api/api.type';
import { AlertCircle, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';

type DeleteAssetDialogProps = {
  asset: AssetResponse;
};

export default function DeleteAssetDialog({ asset }: DeleteAssetDialogProps) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAssetAction(asset.id);

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
            <Trash2 className="size-4" />
            ลบ
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ยืนยันการลบอุปกรณ์</DialogTitle>
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
            ต้องการลบ <span className="font-semibold">{asset.name}</span>{' '}
            ใช่หรือไม่? ระบบจะซ่อนอุปกรณ์นี้จากพนักงาน
            แต่ยังเก็บไว้ในประวัติคำขอเบิกเดิม (Soft Delete)
          </p>
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
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'กำลังลบ...' : 'ลบอุปกรณ์'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
