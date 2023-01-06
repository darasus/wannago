import clsx from 'clsx';
import {forwardRef, PropsWithChildren} from 'react';

type Props = PropsWithChildren & {className?: string};

export const CardBase = forwardRef<HTMLDivElement, Props>(function Card(
  {children, className},
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx(
        'border-2 border-gray-800 bg-gray-50 p-6 rounded-3xl',
        className
      )}
    >
      {children}
    </div>
  );
});
