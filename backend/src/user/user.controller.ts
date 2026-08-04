import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/database/generated/prisma/enums';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ใช้เป็นตัวเลือกในตัวกรอง "ผู้ขอ" ของหน้าคำขอฝั่งแอดมิน (FR-APR-01)
  @Roles(Role.ADMIN)
  @Get()
  async getUsers(): Promise<UserResponseDto[]> {
    return this.userService.getUsers();
  }
}
