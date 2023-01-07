import clsx from 'clsx';

type Props = React.PropsWithChildren & {className?: string};

export function Text({children, className, ...props}: Props) {
  return (
    <p className={clsx('text-md', className)} {...props}>
      {children}
    </p>
  );
}
