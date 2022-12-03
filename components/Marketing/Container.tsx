import clsx from 'clsx';
import {forwardRef, HTMLAttributes, PropsWithChildren} from 'react';

export const Container = forwardRef(function Container(
  {className, ...props}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={clsx('mx-auto max-w-5xl my-4', className)}
      {...props}
    />
  );
});
