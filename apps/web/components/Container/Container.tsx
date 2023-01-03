import clsx from 'clsx';
import {forwardRef, HTMLAttributes, PropsWithChildren} from 'react';

interface Props extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  maxSize?: 'md' | 'lg';
}

export const Container = forwardRef<HTMLDivElement, Props>(function Container(
  {className, maxSize = 'md', ...props},
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx('mx-auto px-4 my-4', className, {
        'max-w-5xl': maxSize === 'md',
        'max-w-7xl': maxSize === 'lg',
      })}
      {...props}
    />
  );
});
