import {ClerkProvider} from '@clerk/nextjs';
import '../styles/globals.css';
import {Container} from 'ui';
import {Header} from './(features)/Header/Header';

export const metadata = {
  title: 'WannaGo',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang="en">
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
        </body>
      </html>
    </ClerkProvider>
  );
}
