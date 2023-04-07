import {HTMLAttributes} from 'react';
import {cn} from '../../../../utils';

type Props = React.PropsWithChildren &
  HTMLAttributes<HTMLParagraphElement> & {
    className?: string;
    truncate?: boolean;
  };

export function Text({children, className, truncate, ...props}: Props) {
  return (
    <p
      className={cn('text-md inline', className, {
        'overflow-hidden text-ellipsis whitespace-nowrap': truncate,
      })}
      {...props}
    >
      {children}
    </p>
  );
}
