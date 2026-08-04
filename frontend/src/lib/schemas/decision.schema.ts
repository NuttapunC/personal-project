import z from 'zod';

export const rejectSchema = z.object({
  adminNote: z
    .string('กรุณากรอกเหตุผลที่ปฏิเสธ')
    .trim()
    .min(1, 'กรุณากรอกเหตุผลที่ปฏิเสธ')
});

export type RejectInput = z.infer<typeof rejectSchema>;
