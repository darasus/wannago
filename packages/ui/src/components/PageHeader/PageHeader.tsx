import {PropsWithChildren} from 'react';
import {titleFont} from '../../../../../apps/web/src/fonts';
import {cn} from '../../../../utils';
import {CardBase} from '../CardBase/CardBase';

interface Props extends PropsWithChildren {
  title: string | JSX.Element;
  className?: string;
}

export function PageHeader({title, children, className}: Props) {
  return (
    <CardBase className={className}>
      <div className="flex items-center flex-row gap-2">
        <div className="flex items-center gap-2 md:gap-4">
          <h1 className={cn(titleFont.className, 'text-2xl')}>{title}</h1>
        </div>
        {children && (
          <>
            <div className="grow" />
            <div className="flex gap-x-2">{children}</div>
          </>
        )}
      </div>
    </CardBase>
  );
}
