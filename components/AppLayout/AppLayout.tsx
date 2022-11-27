import Link from 'next/link';
import {PropsWithChildren} from 'react';
import {Card} from '../DateCard/Card/Card';
import {Text} from '../Text/Text';
import {UserSecsion} from '../UserSecsion/UserSecsion';

export default function AppLayout({children}: PropsWithChildren) {
  return (
    <div className=" p-4 max-w-xl m-auto">
      <Card className="flex mb-4">
        <Link href="/dashboard" className="mr-2">
          <Text>WannaGo</Text>
        </Link>
        <div className="grow" />
        <UserSecsion />
      </Card>
      <div>{children}</div>
    </div>
  );
}
