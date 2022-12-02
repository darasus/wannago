import clsx from 'clsx';
import {HTMLAttributes, PropsWithChildren} from 'react';

export function Container({
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={clsx('mx-auto max-w-5xl m-4', className)} {...props} />
  );
}
