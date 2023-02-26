import {forwardRef, HTMLAttributes, PropsWithChildren} from 'react';
import {cn} from '../../../../../apps/web/utils/cn';

interface Props extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  maxSize?: 'md' | 'lg' | 'full';
}

export const Container = forwardRef<HTMLDivElement, Props>(function Container(
  {className, maxSize = 'md', ...props},
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('mx-auto px-4 my-4', className, {
        'max-w-5xl': maxSize === 'md',
        'max-w-7xl': maxSize === 'lg',
        'max-full': maxSize === 'full',
      })}
      {...props}
    />
  );
});
