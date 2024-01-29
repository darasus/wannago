import './globals.css';

import {Container} from 'ui';
import {getBaseUrl} from 'utils';
import {config} from 'config';
import {Header} from './Header';
import {ToastProvider} from './ToastProvider';
import {ClientProvider} from './ClientProvider';
import {ClientRefresher} from 'features/src/ClientRefresher/ClientRefresher';
import {SpeedInsights} from '@vercel/speed-insights/next';
import {Analytics} from '@vercel/analytics/react';
import {Footer} from './components/Footer';
import {api} from '../trpc/server-http';

export const metadata = {
  title: config.name,
  metadataBase: new URL(getBaseUrl()),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await api.user.me.query();

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
          <div className="flex flex-col min-h-screen">
            {me && (
              <div>
                <Container maxSize={'full'}>
                  <Header />
                </Container>
              </div>
            )}
            <div className="grow">
              <div>{children}</div>
            </div>
            <Footer />
          </div>
          <ToastProvider />
          <ClientRefresher />
        </ClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
