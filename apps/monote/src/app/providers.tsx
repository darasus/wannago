'use client';

import {ReactNode, createContext} from 'react';
import {ThemeProvider, useTheme} from 'next-themes';
import {Toaster} from 'sonner';
import {Analytics} from '@vercel/analytics/react';
import {useLocalStorage} from '../core/hooks/useLocalStorage';

export const AppContext = createContext<{
  font: string;
  setFont: (value: string) => void;
}>({
  font: 'Default',
  setFont: () => {},
});

const ToasterProvider = () => {
  const {theme} = useTheme() as {
    theme: 'light' | 'dark' | 'system';
  };
  return <Toaster theme={theme} />;
};

export function Providers({children}: {children: ReactNode}) {
  const [font, setFont] = useLocalStorage<string>('novel__font', 'Default');

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppContext.Provider
        value={{
          font,
          setFont,
        }}
      >
        <ToasterProvider />
        {children}
        <Analytics />
      </AppContext.Provider>
    </ThemeProvider>
  );
}
