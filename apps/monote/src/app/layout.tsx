import './globals.css';

import {Metadata} from 'next';
import {ReactNode} from 'react';
import {Providers} from './providers';

const title = 'Monote';
const description =
  'Monote - Offline first simple note taking app for your daily thoughts and tasks.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@darasus_',
  },
  metadataBase: new URL('https://www.monote.ai/'),
  // themeColor: '#ffffff',
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
