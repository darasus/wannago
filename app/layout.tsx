import '../styles/globals.css';

import {ClerkProvider, currentUser} from '@clerk/nextjs/app-beta';
import {UserSecsion} from '../components/UserSecsion/UserSecsion';
import {Text} from '../components/Text/Text';
import {Card} from '../components/Card/Card';
import Link from 'next/link';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <ClerkProvider>
      <html>
        <head />
        <body className="bg-gray-100 p-4 max-w-xl m-auto">
          <Card className="flex mb-4">
            <Link href="/" className="mr-2">
              <Text>WannaGo</Text>
            </Link>
            <a href="/event/add">add</a>
            <div className="grow" />
            {user && (
              <div>
                <UserSecsion user={user} />
              </div>
            )}
          </Card>
          <div>{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
