import React from 'react';
import {cn} from '../../../../utils';

type Props = React.PropsWithChildren & {
  className?: string;
  color?:
    | 'gray'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'indigo'
    | 'purple'
    | 'pink'
    | 'red';
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
};

export function Badge({
  children,
  className,
  color = 'gray',
  size = 'md',
  ...props
}: Props) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center rounded-full text-sm font-bold shrink-0',
        className,
        {
          'bg-gray-200 text-slate-700': color === 'gray',
          'bg-yellow-100 text-yellow-700': color === 'yellow',
          'bg-green-100 text-green-700': color === 'green',
          'bg-blue-100 text-blue-700': color === 'blue',
          'bg-indigo-100 text-indigo-700': color === 'indigo',
          'bg-purple-100 text-purple-700': color === 'purple',
          'bg-pink-100 text-pink-700': color === 'pink',
          'bg-red-100 text-red-700': color === 'red',
        },
        {
          'h-4 px-1 text-[10px]': size === 'xxs',
          'h-6 px-2 text-xs': size === 'xs',
          'h-8 px-2 text-sm': size === 'sm',
          'h-11 px-4 text-base': size === 'md',
          'h-16 px-6 text-md': size === 'lg',
        }
      )}
    >
      {children}
    </span>
  );
}
