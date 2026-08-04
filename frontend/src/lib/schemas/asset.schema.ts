import z from 'zod';

export const assetSchema = z.object({
  name: z.string('กรุณากรอกชื่ออุปกรณ์').min(1, 'กรุณากรอกชื่ออุปกรณ์'),
  categoryId: z.uuid('กรุณาเลือกหมวดหมู่'),
  stockQty: z
    .number('กรุณากรอกจำนวนเป็นตัวเลข')
    .int('จำนวนต้องเป็นจำนวนเต็ม')
    .min(0, 'จำนวนคงคลังต้องไม่ติดลบ')
});

export type AssetInput = z.infer<typeof assetSchema>;
