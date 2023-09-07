'use client';

import {ReactNode} from 'react';
import {ThemeProvider, useTheme} from 'next-themes';
import {Toaster} from 'sonner';
import {Analytics} from '@vercel/analytics/react';

const ToasterProvider = () => {
  const {theme} = useTheme() as {
    theme: 'light' | 'dark' | 'system';
  };
  return <Toaster theme={theme} />;
};

export function Providers({children}: {children: ReactNode}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToasterProvider />
      {children}
      <Analytics />
    </ThemeProvider>
  );
}
