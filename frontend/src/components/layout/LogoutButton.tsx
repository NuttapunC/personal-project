'use client';

import { logoutAction } from '@/lib/actions/auth.action';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <Button
      variant="outline"
      onClick={async () => await logoutAction()}
    >
      <LogOut />
      ออกจากระบบ
    </Button>
  );
}
