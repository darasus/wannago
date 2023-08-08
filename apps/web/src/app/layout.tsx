import './globals.css';

import {ClerkProvider} from '@clerk/nextjs';
import {Container} from 'ui';
import {getBaseUrl} from 'utils';
import {Header} from '../features/Header/Header';
import {Tools} from '../features/Tools';
import {ToastProvider} from '../features/ToastProvider';
import {Scripts} from '../features/Scripts';
import {ThemeProvider} from './ThemeProvider';

export const metadata = {
  title: 'WannaGo',
  metadataBase: new URL(getBaseUrl()),
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="shortcut icon" href={`${getBaseUrl()}/favicon.png`} />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        </head>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div>
              <div>
                <Container maxSize={'full'}>
                  <Header />
                </Container>
              </div>
              <div>
                <div>{children}</div>
              </div>
            </div>
            <Tools />
            <ToastProvider />
          </ThemeProvider>
        </body>
        <Scripts />
      </html>
    </ClerkProvider>
  );
}
