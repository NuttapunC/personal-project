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
import { createRequestAction } from '@/lib/actions/request.action';
import { AssetResponse } from '@/lib/api/api.type';
import { RequestInput, requestSchema } from '@/lib/schemas/request.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, PackagePlus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

type CreateRequestDialogProps = {
  asset: AssetResponse;
};

export default function CreateRequestDialog({
  asset
}: CreateRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const defaultValues: RequestInput = {
    assetId: asset.id,
    quantity: 1,
    reason: ''
  };

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<RequestInput>({
    resolver: zodResolver(requestSchema),
    defaultValues
  });

  const onSubmit = (data: RequestInput) => {
    startTransition(async () => {
      const result = await createRequestAction(data);

      if (!result.success) {
        setError('root', { message: result.message });
        return;
      }

      setOpen(false);
      reset(defaultValues);
    });
  };

  const isOutOfStock = asset.stockQty === 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(current) => {
        setOpen(current);
        if (!current) {
          reset(defaultValues);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm" disabled={isOutOfStock} data-slot="dialog-trigger">
            <PackagePlus className="size-4" />
            {isOutOfStock ? 'ของหมด' : 'เบิก'}
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>สร้างคำขอเบิก</DialogTitle>
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
              <p className="font-semibold">{asset.name}</p>
              <p className="text-muted-foreground">
                หมวดหมู่ {asset.category.name} · คงคลัง {asset.stockQty} ชิ้น
              </p>
            </div>

            <Controller
              control={control}
              name="quantity"
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>จำนวนที่ขอเบิก</FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    max={asset.stockQty}
                    id={field.name}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={Number.isNaN(field.value) ? '' : field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="reason"
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>เหตุผลการเบิก</FieldLabel>
                  <Input
                    placeholder="เช่น ใช้สำหรับงานพัฒนาระบบ"
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
              <Button type="submit" disabled={isPending}>
                {isPending ? 'กำลังส่งคำขอ...' : 'ส่งคำขอ'}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
