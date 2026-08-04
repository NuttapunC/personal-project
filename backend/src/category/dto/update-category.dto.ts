import { Trim } from '@/common/decorators/trim.decorator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  name?: string;

  @IsString()
  @IsOptional()
  @Trim()
  description?: string;
}
