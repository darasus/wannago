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
        'border-b drop-shadow-sm shadow-gray-300 border-gray-200 bg-white p-4 rounded-xl',
        className
      )}
    >
      {children}
    </div>
  );
});
