import {forwardRef, PropsWithChildren} from 'react';
import {cn} from '../../../../utils';

type Props = PropsWithChildren & {
  className?: string;
  innerClassName?: string;
  variant?: 'normal' | 'translucent';
  isBlur?: boolean;
};

export const CardBase = forwardRef<HTMLDivElement, Props>(function Card(
  {children, className, variant = 'normal', isBlur, innerClassName, ...props},
  ref
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'p-6 rounded-3xl border-2',
        {'border-gray-800 bg-white': variant === 'normal'},
        {'border-black/10 bg-black/5': variant === 'translucent'},
        {'blur-[3px] pointer-events-none': isBlur},
        className
      )}
    >
      <div
        className={cn(
          {'blur-[3px] pointer-events-none': isBlur},
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
});
