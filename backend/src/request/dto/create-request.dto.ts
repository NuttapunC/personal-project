import { Trim } from '@/common/decorators/trim.decorator';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class CreateRequestDto {
  @IsUUID()
  @IsNotEmpty()
  assetId: string;

  @Min(1)
  @IsInt()
  @Type(() => Number)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @Trim()
  reason: string;
}
