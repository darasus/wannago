import clsx from 'clsx';
import {HTMLAttributes} from 'react';

export function BubbleMenuButton({
  children,
  isActive,
  className,
  onClick,
  ...props
}: HTMLAttributes<HTMLButtonElement> & {isActive: boolean}) {
  return (
    <button
      {...props}
      className={clsx(
        'relative inline-flex items-center border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
        {'font-bold': isActive},
        className
      )}
      onClick={e => {
        e.preventDefault();
        onClick?.(e);
      }}
    >
      {children}
    </button>
  );
}
