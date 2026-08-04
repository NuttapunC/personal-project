import z from 'zod';

export const requestSchema = z.object({
  assetId: z.uuid('กรุณาเลือกอุปกรณ์'),
  quantity: z
    .number('กรุณากรอกจำนวนเป็นตัวเลข')
    .int('จำนวนต้องเป็นจำนวนเต็ม')
    .min(1, 'จำนวนที่ขอต้องมากกว่า 0'),
  reason: z.string('กรุณากรอกเหตุผลการเบิก').min(1, 'กรุณากรอกเหตุผลการเบิก')
});

export type RequestInput = z.infer<typeof requestSchema>;
