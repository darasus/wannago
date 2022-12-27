import clsx from 'clsx';
import React from 'react';

type Props = React.PropsWithChildren & {
  className?: string;
  color?: 'gray' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';
};

export function Badge({children, className, color = 'gray'}: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-bold',
        className,
        {
          'bg-gray-200 text-slate-800': color === 'gray',
          'bg-yellow-100 text-yellow-800': color === 'yellow',
          'bg-green-100 text-green-800': color === 'green',
          'bg-blue-100 text-blue-800': color === 'blue',
          'bg-indigo-100 text-indigo-800': color === 'indigo',
          'bg-purple-100 text-purple-800': color === 'purple',
          'bg-pink-100 text-pink-800': color === 'pink',
        }
      )}
    >
      {children}
    </span>
  );
}
