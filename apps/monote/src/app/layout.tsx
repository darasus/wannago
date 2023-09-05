import './globals.css';

import {Container} from 'ui';
import {getBaseUrl} from 'utils';
import {Header} from '../features/Header/Header';
import {Tools} from '../features/Tools';
import {ToastProvider} from '../features/ToastProvider';
import {Scripts} from '../features/Scripts';
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
            <Container maxSize={'full'}>
              <Header />
            </Container>
          </div>
          <div>
            <div>{children}</div>
          </div>
          <Tools />
          <ToastProvider />
        </ClientProvider>
      </body>
      <Scripts />
    </html>
  );
}
