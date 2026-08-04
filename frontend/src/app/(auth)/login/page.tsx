import LoginForm from '@/components/features/auth/LoginForm';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ'
};

export default function LoginPage() {
  return (
    <div className="grid gap-6 w-full max-w-xl p-4">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary">
          Asset Request System
        </h1>
        <p className="text-muted-foreground">ระบบเบิกอุปกรณ์สำนักงาน</p>
      </div>
      <h2 className="text-lg font-semibold">เข้าสู่ระบบ</h2>
      {/* LoginForm */}
      <LoginForm />
      {/* Create new account button */}
      <Button
        className="rounded-full text-primary hover:text-primary border-primary py-5"
        variant="outline"
        nativeButton={false}
        render={<Link href="/signup">สมัครสมาชิกใหม่</Link>}
      />
    </div>
  );
}
