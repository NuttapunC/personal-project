import { ConflictException, Injectable } from '@nestjs/common';
import { BcryptService } from '@/infrastructure/hash/bcrypt.service';
import { PrismaService } from '@/database/prisma.service';
import {
  PrismaClientKnownRequestError,
  UserGetPayload
} from '@/database/generated/prisma/internal/prismaNamespace';
import { User } from '@/database/generated/prisma/client';

export type UserCreateInput = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UserService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly prisma: PrismaService
  ) {}

  async createUser(input: UserCreateInput): Promise<void> {
    const hash = await this.bcryptService.hash(input.password);

    try {
      await this.prisma.user.create({ data: { ...input, password: hash } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exist');
        }
      }
      throw error;
    }
  }

  getUsers(): Promise<UserGetPayload<{ omit: { password: true } }>[]> {
    return this.prisma.user.findMany({
      omit: { password: true },
      orderBy: { name: 'asc' }
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getUserById(
    id: string
  ): Promise<UserGetPayload<{ omit: { password: true } }> | null> {
    return this.prisma.user.findUnique({
      where: { id },
      omit: { password: true }
    });
  }
}
