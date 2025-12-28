'use client';

import { type ReactNode } from 'react';

import { TanstackQueryProvider } from './TanstackQueryProvider';

export function MainProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <TanstackQueryProvider>{children}</TanstackQueryProvider>;
}
