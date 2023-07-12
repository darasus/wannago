import {ClerkProvider} from '@clerk/nextjs';
import './globals.css';
import {Container} from 'ui';
import {getBaseUrl} from 'utils';
import {Header} from '../features/Header/Header';
import {Tools} from '../features/Tools';
import {ToastProvider} from '../features/ToastProvider';
import {Scripts} from '../features/Scripts';

export const metadata = {
  title: 'WannaGo',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="shortcut icon" href={`${getBaseUrl()}/api/favicon`} />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        </head>
        <body>
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
        </body>
        <Scripts />
      </html>
    </ClerkProvider>
  );
}
