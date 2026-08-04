import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const user = request.auth?.user;

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // ยังไม่ login: เข้าได้เฉพาะหน้า login/signup
  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // login แล้ว: ไม่ต้องกลับไปหน้า login/signup อีก
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // หน้ากลุ่ม /admin เข้าได้เฉพาะ ADMIN (Backend มี RolesGuard ตรวจซ้ำอีกชั้น)
  if (pathname.startsWith('/admin') && user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|ico)$).*)']
};
