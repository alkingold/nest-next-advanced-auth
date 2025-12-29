'use client';

import { type ReactNode } from 'react';

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
        {children}
      </ThemeProvider>
    </TanstackQueryProvider>
  );
}
