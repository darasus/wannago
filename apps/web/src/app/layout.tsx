import {ClerkProvider} from '@clerk/nextjs';
import '../styles/globals.css';
import {Container} from 'ui';
import {Header} from './(features)/Header/Header';
import {ToastProvider} from './(features)/ToastProvider';
import {Scripts} from './(features)/Scripts';
import {Tools} from './(features)/Tools';
import {getBaseUrl} from 'utils';

export const metadata = {
  title: 'WannaGo',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <Scripts />
          <link rel="shortcut icon" href={`${getBaseUrl()}/api/favicon`} />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
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
      </html>
    </ClerkProvider>
  );
}
