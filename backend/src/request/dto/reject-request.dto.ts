import { Trim } from '@/common/decorators/trim.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class RejectRequestDto {
  // บังคับระบุเหตุผลทุกครั้งที่ปฏิเสธ (FR-APR-03)
  @IsString()
  @IsNotEmpty()
  @Trim()
  adminNote: string;
}
