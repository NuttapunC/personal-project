import { Role } from '@/database/generated/prisma/enums';

export class UserResponseDto {
  id: string;

  email: string;

  name: string;

  role: Role;

  createdAt: Date;
}
