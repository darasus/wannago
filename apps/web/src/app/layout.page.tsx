import {ClerkProvider} from '@clerk/nextjs';
import '../styles/globals.css';

export const metadata = {
  title: 'WannaGo',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}