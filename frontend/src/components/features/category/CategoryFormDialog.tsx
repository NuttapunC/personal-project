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
  createCategoryAction,
  updateCategoryAction
} from '@/lib/actions/category.action';
import { CategoryResponse } from '@/lib/api/api.type';
import { CategoryInput, categorySchema } from '@/lib/schemas/category.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Pencil, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

type CategoryFormDialogProps = {
  // ไม่ส่ง category มา = โหมดเพิ่มใหม่, ส่งมา = โหมดแก้ไข
  category?: CategoryResponse;
};

export default function CategoryFormDialog({
  category
}: CategoryFormDialogProps) {
  const isEditMode = Boolean(category);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? '',
      description: category?.description ?? ''
    }
  });

  const onSubmit = (data: CategoryInput) => {
    startTransition(async () => {
      const result = isEditMode
        ? await updateCategoryAction(category!.id, data)
        : await createCategoryAction(data);

      if (!result.success) {
        setError('root', { message: result.message });
        return;
      }

      setOpen(false);
      if (!isEditMode) {
        reset({ name: '', description: '' });
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(current) => {
        setOpen(current);
        if (!current) {
          reset({
            name: category?.name ?? '',
            description: category?.description ?? ''
          });
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
              เพิ่มหมวดหมู่
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
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
                  <FieldLabel htmlFor={field.name}>ชื่อหมวดหมู่</FieldLabel>
                  <Input
                    placeholder="เช่น Computer"
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
              name="description"
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    คำอธิบาย (ไม่บังคับ)
                  </FieldLabel>
                  <Input
                    placeholder="เช่น คอมพิวเตอร์และโน้ตบุ๊ก"
                    id={field.name}
                    {...field}
                    value={field.value ?? ''}
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
