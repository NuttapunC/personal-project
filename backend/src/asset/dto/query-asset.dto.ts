import { Trim } from '@/common/decorators/trim.decorator';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class QueryAssetDto {
  // ค้นหาจากชื่ออุปกรณ์ (บางส่วนของคำ ไม่สนตัวพิมพ์เล็ก-ใหญ่)
  @IsString()
  @IsOptional()
  @Trim()
  search?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @Max(100)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  limit?: number;
}
