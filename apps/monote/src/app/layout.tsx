import './globals.css';

import {Metadata} from 'next';
import {ReactNode} from 'react';
import {Providers} from './providers';
import {HelpSidePanel} from '../Feautres/HelpSidePanel/HelpSidePanel';
import {SettingsMenu} from '../Feautres/SettingsMenu';
import {HelpButton} from '../Feautres/HelpButton/HelpButton';
import {SaveBadge} from '../Feautres/SaveBadge/SaveBadge';

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
          <div className="flex">
            <div className="grow">
              <div className="flex py-2 px-3 items-center gap-2 justify-end">
                <SaveBadge />
                <SettingsMenu />
                <HelpButton />
              </div>
              <div>
                <div className="grow p-4 pt-0">{children}</div>
              </div>
            </div>
            <HelpSidePanel />
          </div>
        </Providers>
      </body>
    </html>
  );
}
