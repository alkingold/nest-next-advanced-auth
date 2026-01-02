'use client';

import { type ReactNode } from 'react';

import { ToastProvider } from '@/shared/providers/ToastProvider';

import { TanstackQueryProvider } from './TanstackQueryProvider';
import { ThemeProvider } from './ThemeProvider';

export function MainProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <TanstackQueryProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        disableTransitionOnChange
        storageKey='full-auth-theme'
      >
        <ToastProvider />
        {children}
      </ThemeProvider>
    </TanstackQueryProvider>
  );
}
