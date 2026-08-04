import Header from '@/components/layout/Header';

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl p-4">{children}</main>
    </div>
  );
}
