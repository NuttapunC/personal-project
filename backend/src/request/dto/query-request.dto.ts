import { RequestStatus } from '@/database/generated/prisma/enums';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class QueryRequestDto {
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;

  // ใช้เฉพาะฝั่ง Admin เพื่อกรองตามผู้ขอ
  @IsUUID()
  @IsOptional()
  userId?: string;

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
