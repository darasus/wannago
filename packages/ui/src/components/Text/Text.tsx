import {cn} from '../../../../utils';

type Props = React.PropsWithChildren & {className?: string};

export function Text({children, className, ...props}: Props) {
  return (
    <p className={cn('text-md inline', className)} {...props}>
      {children}
    </p>
  );
}
