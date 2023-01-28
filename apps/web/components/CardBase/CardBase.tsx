import {forwardRef, PropsWithChildren} from 'react';
import {cn} from '../../utils/cn';

type Props = PropsWithChildren & {
  className?: string;
  variant?: 'normal' | 'translucent';
};

export const CardBase = forwardRef<HTMLDivElement, Props>(function Card(
  {children, className, variant = 'normal'},
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'p-6 rounded-3xl border-2',
        {'border-gray-800 bg-white': variant === 'normal'},
        {'border-black/10 bg-black/5': variant === 'translucent'},
        {},
        className
      )}
    >
      {children}
    </div>
  );
});
