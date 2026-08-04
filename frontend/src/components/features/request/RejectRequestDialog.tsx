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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { rejectRequestAction } from '@/lib/actions/request.action';
import { RequestResponse } from '@/lib/api/api.type';
import { RejectInput, rejectSchema } from '@/lib/schemas/decision.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

type RejectRequestDialogProps = {
  request: RequestResponse;
};

export default function RejectRequestDialog({
  request
}: RejectRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<RejectInput>({
    resolver: zodResolver(rejectSchema),
    defaultValues: { adminNote: '' }
  });

  const onSubmit = (data: RejectInput) => {
    startTransition(async () => {
      const result = await rejectRequestAction(request.id, data.adminNote);

      if (!result.success) {
        setError('root', { message: result.message });
        return;
      }

      setOpen(false);
      reset({ adminNote: '' });
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(current) => {
        setOpen(current);
        if (!current) {
          reset({ adminNote: '' });
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
            <X className="size-4" />
            ปฏิเสธ
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ปฏิเสธคำขอเบิก</DialogTitle>
        </DialogHeader>

        {/* noValidate: ให้ zod เป็นคนตรวจ จะได้ข้อความภาษาไทย ไม่ใช่ข้อความอังกฤษของเบราว์เซอร์ */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="gap-4">
            {errors.root && (
              <Alert
                variant="destructive"
                className="bg-destructive/15 border-destructive"
              >
                <AlertCircle />
                <AlertTitle>{errors.root.message}</AlertTitle>
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
            </div>

            <Controller
              control={control}
              name="adminNote"
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    เหตุผลที่ปฏิเสธ (ผู้ขอจะเห็นข้อความนี้)
                  </FieldLabel>
                  <Input
                    placeholder="เช่น งบประมาณไตรมาสนี้ไม่พอ"
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <DialogFooter>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? 'กำลังปฏิเสธ...' : 'ยืนยันปฏิเสธ'}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
