import {PropsWithChildren} from 'react';
import {cn} from '../../utils/cn';

interface Props extends PropsWithChildren {
  className?: string;
}

export function TitleCard({children, className}: Props) {
  return (
    <span
      className={cn(
        'block bg-black/5 font-bold rounded-3xl p-4 text-xl border-2 border-black/10 text-center',
        className
      )}
    >
      {children}
    </span>
  );
}
