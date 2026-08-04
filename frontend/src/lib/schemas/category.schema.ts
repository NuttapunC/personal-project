import z from 'zod';

export const categorySchema = z.object({
  name: z.string('กรุณากรอกชื่อหมวดหมู่').min(1, 'กรุณากรอกชื่อหมวดหมู่'),
  description: z.string().optional()
});

export type CategoryInput = z.infer<typeof categorySchema>;
