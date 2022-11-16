'use client';

import clsx from 'clsx';
import {PropsWithChildren} from 'react';

type Props = PropsWithChildren & {className?: string};

export function Card({children, className}: Props) {
  return (
    <div
      className={clsx(
        'border-b drop-shadow-sm shadow-gray-300 border-gray-200 bg-white px-4 py-5 sm:px-6 rounded-xl',
        className
      )}
    >
      {children}
    </div>
  );
}
