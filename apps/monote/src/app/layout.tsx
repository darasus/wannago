import './globals.css';

import {getBaseUrl} from 'utils/src/getBaseUrl';
import {ToastProvider} from '../features/ToastProvider';
import {ClientProvider} from './ClientProvider';

export const metadata = {
  title: 'Monote',
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
            <div>{children}</div>
          </div>
          <ToastProvider />
        </ClientProvider>
      </body>
    </html>
  );
}
