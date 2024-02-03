import {Analytics} from '@vercel/analytics/react';
import {SpeedInsights} from '@vercel/speed-insights/next';
import {config} from 'config';
import {ClientRefresher} from 'features/src/ClientRefresher/ClientRefresher';
import {Footer} from 'ui/src/Footer/Footer';
import {getBaseUrl} from 'utils';

import {ClientProvider} from './ClientProvider';
import {ToastProvider} from './ToastProvider';

import './globals.css';

export const metadata = {
  title: config.name,
  metadataBase: new URL(getBaseUrl()),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
