import Link from 'next/link';
import {PropsWithChildren} from 'react';
import {CardBase} from '../Card/CardBase/CardBase';
import {UserSecsion} from '../UserSecsion/UserSecsion';
import {Paytone_One as LogoFont} from '@next/font/google';
import clsx from 'clsx';

const logoFong = LogoFont({
  weight: '400',
  display: 'swap',
});

export default function AppLayout({children}: PropsWithChildren) {
  return (
    <div className="p-4 max-w-xl m-auto">
      <CardBase className="flex mb-4">
        <Link href="/dashboard" className="mr-2">
          <span
            className={clsx(
              logoFong.className,
              'text-xl leading-none text-brand-500'
            )}
          >
            WannaGo
          </span>
        </Link>
        <div className="grow" />
        <UserSecsion />
      </CardBase>
      <div>{children}</div>
    </div>
  );
}
