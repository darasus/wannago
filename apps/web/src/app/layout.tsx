import './globals.css';

import {Container} from 'ui';
import {getBaseUrl} from 'utils';
import {Header} from './Header';
import {ToastProvider} from './ToastProvider';
import {ClientProvider} from './ClientProvider';
import {ClientRefresher} from 'features/src/ClientRefresher/ClientRefresher';
import {SpeedInsights} from '@vercel/speed-insights/next';
import {Analytics} from '@vercel/analytics/react';
import {Footer} from './components/Footer';

export const metadata = {
  title: 'WannaGo',
  metadataBase: new URL(getBaseUrl()),
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href={`${getBaseUrl()}/favicon.png`} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </head>
      <body>
        <ClientProvider>
          <div>
            <Container maxSize={'full'}>
              <Header />
            </Container>
          </div>
          <div>
            <div>{children}</div>
          </div>
          <Footer />
          <Analytics />
          <ToastProvider />
          <ClientRefresher />
        </ClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
