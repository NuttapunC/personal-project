import 'next-auth';
import 'next-auth/jwt';
import { Role } from '@/lib/api/api.type';

declare module 'next-auth' {
  interface User {
    id: string;
    role?: Role;
    access_token?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;
    role?: Role;
    access_token?: string;
  }
}
