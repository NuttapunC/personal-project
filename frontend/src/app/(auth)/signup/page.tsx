import SignupForm from '@/components/features/auth/SignupForm';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'สมัครสมาชิก'
};

export default function SignupPage() {
  return (
    <div className="grid gap-6 w-full max-w-xl p-4">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary">
          Asset Request System
        </h1>
        <p className="text-muted-foreground">ระบบเบิกอุปกรณ์สำนักงาน</p>
      </div>
      <h2 className="text-lg font-semibold">สมัครสมาชิก</h2>
      {/* SignupForm */}
      <SignupForm />
      {/* Back to login */}
      <Button
        className="rounded-full text-primary hover:text-primary border-primary py-5"
        variant="outline"
        nativeButton={false}
        render={<Link href="/login">มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</Link>}
      />
    </div>
  );
}
