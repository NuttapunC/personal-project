import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { notoSansThai } from '@/styles/font';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Asset Request System',
    default: 'Asset Request System'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={cn('antialiased', 'font-sans', notoSansThai.variable)}
    >
      <body className="bg-muted-foreground/5">{children}</body>
    </html>
  );
}
