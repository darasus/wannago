import {ReactNode} from 'react';
import {titleFontClassName} from '../../../../../apps/web/src/fonts';
import {cn} from 'utils';

interface Props {
  id?: string;
  description?: string;
  children: ReactNode;
}

export function Title({children, id, description}: Props) {
  return (
    <div className="mx-auto text-center mb-16 max-w-4xl">
      <h2
        className={cn(
          'font-black text-3xl tracking-tight sm:text-7xl',
          titleFontClassName
        )}
      >
        {children}
      </h2>
      <p className="mt-4 font-medium text-xl tracking-tight">{description}</p>
    </div>
  );
}
