import { auth } from '@/lib/auth';
import LogoutButton from './LogoutButton';
import NavigationItem from './NavigationItem';

// เมนูจะเพิ่มขึ้นเรื่อยๆ ตามฟีเจอร์ที่ทำเสร็จ (ดู docs/00-overview.md)
const USER_MENU = [
  { href: '/assets', label: 'รายการอุปกรณ์' },
  { href: '/requests', label: 'คำขอของฉัน' }
];

const ADMIN_MENU = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/requests', label: 'คำขอทั้งหมด' },
  { href: '/admin/assets', label: 'จัดการอุปกรณ์' },
  { href: '/admin/categories', label: 'จัดการหมวดหมู่' }
];

export default async function Header() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';
  const menu = isAdmin ? ADMIN_MENU : USER_MENU;

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 p-4">
        <span className="font-bold text-primary">Asset Request</span>

        <nav className="flex flex-1 flex-wrap gap-1">
          {menu.map((item) => (
            <NavigationItem key={item.href} {...item} />
          ))}
        </nav>

        <span className="text-sm text-muted-foreground">
          {session?.user?.name} ({isAdmin ? 'ผู้ดูแล' : 'พนักงาน'})
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
