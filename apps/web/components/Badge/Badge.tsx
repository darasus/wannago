import clsx from 'clsx';
import React from 'react';

type Props = React.PropsWithChildren & {
  className?: string;
  color?: 'gray' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
};

export function Badge({
  children,
  className,
  color = 'gray',
  size = 'md',
}: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full text-sm font-bold shrink-0',
        className,
        {
          'bg-gray-200 text-slate-800': color === 'gray',
          'bg-yellow-100 text-yellow-800': color === 'yellow',
          'bg-green-100 text-green-800': color === 'green',
          'bg-blue-100 text-blue-800': color === 'blue',
          'bg-indigo-100 text-indigo-800': color === 'indigo',
          'bg-purple-100 text-purple-800': color === 'purple',
          'bg-pink-100 text-pink-800': color === 'pink',
        },
        {
          'text-xs px-2 py-0.5': size === 'sm',
          'px-3 py-1': size === 'md',
          'px-4 py-2': size === 'lg',
        }
      )}
    >
      {children}
    </span>
  );
}
