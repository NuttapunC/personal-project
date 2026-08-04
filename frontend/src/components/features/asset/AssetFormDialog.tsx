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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  createAssetAction,
  updateAssetAction
} from '@/lib/actions/asset.action';
import { AssetResponse, CategoryResponse } from '@/lib/api/api.type';
import { AssetInput, assetSchema } from '@/lib/schemas/asset.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Pencil, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

type AssetFormDialogProps = {
  categories: CategoryResponse[];
  // ไม่ส่ง asset มา = โหมดเพิ่มใหม่, ส่งมา = โหมดแก้ไข
  asset?: AssetResponse;
};

export default function AssetFormDialog({
  categories,
  asset
}: AssetFormDialogProps) {
  const isEditMode = Boolean(asset);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // base-ui ใช้ map นี้แปลงค่าที่เก็บ (UUID) เป็นชื่อหมวดหมู่ที่แสดงบนปุ่ม
  const categoryLabels = Object.fromEntries(
    categories.map((category) => [category.id, category.name])
  );

  const defaultValues: AssetInput = {
    name: asset?.name ?? '',
    categoryId: asset?.categoryId ?? '',
    stockQty: asset?.stockQty ?? 0
  };

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<AssetInput>({
    resolver: zodResolver(assetSchema),
    defaultValues
  });

  const onSubmit = (data: AssetInput) => {
    startTransition(async () => {
      const result = isEditMode
        ? await updateAssetAction(asset!.id, data)
        : await createAssetAction(data);

      if (!result.success) {
        setError('root', { message: result.message });
        return;
      }

      setOpen(false);
      if (!isEditMode) {
        reset({ name: '', categoryId: '', stockQty: 0 });
      }
    });
  };

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
          isEditMode ? (
            <Button variant="outline" size="sm" data-slot="dialog-trigger">
              <Pencil className="size-4" />
              แก้ไข
            </Button>
          ) : (
            <Button data-slot="dialog-trigger">
              <Plus className="size-4" />
              เพิ่มอุปกรณ์
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'แก้ไขอุปกรณ์' : 'เพิ่มอุปกรณ์ใหม่'}
          </DialogTitle>
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

            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>ชื่ออุปกรณ์</FieldLabel>
                  <Input
                    placeholder="เช่น โน้ตบุ๊ก Dell Latitude"
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

            <Controller
              control={control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>หมวดหมู่</FieldLabel>
                  <Select
                    name={field.name}
                    items={categoryLabels}
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="stockQty"
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>จำนวนคงคลัง</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    id={field.name}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={Number.isNaN(field.value) ? '' : field.value}
                    // ช่อง number ส่งค่าเป็น string ต้องแปลงเป็นตัวเลขก่อนเข้า zod
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
