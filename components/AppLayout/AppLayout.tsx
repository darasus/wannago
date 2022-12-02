import {PropsWithChildren} from 'react';
import {CardBase} from '../Card/CardBase/CardBase';
import {UserSecsion} from '../UserSecsion/UserSecsion';
import {Logo} from '../Logo/Logo';

export default function AppLayout({children}: PropsWithChildren) {
  return (
    <div className="p-4 max-w-xl m-auto">
      <CardBase className="flex items-center mb-4">
        <Logo href="/dashboard" />
        <div className="grow" />
        <UserSecsion />
      </CardBase>
      <div>{children}</div>
    </div>
  );
}
