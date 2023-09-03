'use client';

import * as React from 'react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import {TRPCReactProvider} from './providers';

export function ClientProvider({children}: {children: React.ReactNode}) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </NextThemesProvider>
  );
}
