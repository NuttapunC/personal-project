import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // นำทางตามบทบาท (FR-AUTH-02)
  if (session.user.role === 'ADMIN') {
    redirect('/admin/dashboard');
  }

  redirect('/assets');
}
