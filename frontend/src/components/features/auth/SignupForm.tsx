'use client';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signupAction } from '@/lib/actions/auth.action';
import { SignupInput, signupSchema } from '@/lib/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function SignupForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: SignupInput) => {
    startTransition(async () => {
      const { code, message } = await signupAction(data);
      if (code === 'EMAIL_ALREADY_EXISTS') {
        setError('root', { message });
      }
    });
  };

  // noValidate: ให้ zod เป็นคนตรวจ จะได้ข้อความภาษาไทย ไม่ใช่ข้อความอังกฤษของเบราว์เซอร์
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-4">
        {/* Alert error message */}
        {errors.root && (
          <Alert
            variant="destructive"
            className="bg-destructive/15 border-destructive"
          >
            <AlertCircle />
            <AlertTitle>{errors.root.message}</AlertTitle>
          </Alert>
        )}

        {/* Name */}
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>ชื่อ-นามสกุล</FieldLabel>
              <Input
                placeholder="สมชาย ใจดี"
                id={field.name}
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* Email address */}
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>อีเมล</FieldLabel>
              <Input
                type="email"
                placeholder="a@mail.com"
                id={field.name}
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)
              </FieldLabel>
              <Input
                placeholder="••••••••"
                type="password"
                id={field.name}
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* Submit button */}
        <Field>
          <Button
            type="submit"
            className="rounded-full py-5"
            disabled={isPending}
          >
            {isPending ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
