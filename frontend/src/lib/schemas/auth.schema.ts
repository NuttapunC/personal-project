import z from 'zod';

export const signupSchema = z.object({
  name: z.string('กรุณากรอกชื่อ').min(1, 'กรุณากรอกชื่อ'),
  email: z.email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z
    .string('กรุณากรอกรหัสผ่าน')
    .min(8, 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร')
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string('กรุณากรอกรหัสผ่าน').min(1, 'กรุณากรอกรหัสผ่าน')
});

export type LoginInput = z.infer<typeof loginSchema>;
