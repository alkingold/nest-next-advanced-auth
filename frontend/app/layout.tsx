import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ToggleTheme } from '@/shared/components/ui';
import { MainProvider } from '@/shared/providers';

import '../shared/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    absolute: 'Fullstack Authentication App',
    template: '%s | Fullstack Authentication App',
  },
  description:
    'This is a fullstack authentication app using Next.js, Nest.js and Prisma/PostgreSQL.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MainProvider>
          <div className='relative flex min-h-screen flex-col'>
            <ToggleTheme />
            <div className='flex h-screen w-full items-center justify-center px-4'>
              {children}
            </div>
          </div>
        </MainProvider>
      </body>
    </html>
  );
}
