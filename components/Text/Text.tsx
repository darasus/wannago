import clsx from 'clsx';

type Props = React.PropsWithChildren & {className?: string};

export function Text({children, className}: Props) {
  return <span className={clsx('text-md', className)}>{children}</span>;
}
