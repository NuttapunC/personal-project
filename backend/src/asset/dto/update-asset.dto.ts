import { Trim } from '@/common/decorators/trim.decorator';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min
} from 'class-validator';

export class UpdateAssetDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  name?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @Min(0)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  stockQty?: number;
}
