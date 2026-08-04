import { Role } from '@/database/generated/prisma/enums';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'ROLES';

export function Roles(...roles: Role[]) {
  return SetMetadata(ROLES_KEY, roles);
}
