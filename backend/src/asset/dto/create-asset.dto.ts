import { Trim } from '@/common/decorators/trim.decorator';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @Min(0)
  @IsInt()
  @Type(() => Number)
  stockQty: number;
}
