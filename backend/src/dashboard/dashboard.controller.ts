import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/database/generated/prisma/enums';

@Controller('admin')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // รวมข้อมูลสรุปทุกอย่างไว้ใน endpoint เดียว หน้าเว็บจะได้ยิงครั้งเดียวจบ
  @Roles(Role.ADMIN)
  @Get('stats')
  async getStats(): Promise<DashboardStatsDto> {
    return this.dashboardService.getStats();
  }
}
