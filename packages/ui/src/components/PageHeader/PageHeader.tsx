import {PropsWithChildren} from 'react';
import {titleFont} from '../../../../../apps/web/src/fonts';
import {cn} from '../../../../utils';
import {CardBase} from '../CardBase/CardBase';

interface Props extends PropsWithChildren {
  title: string;
  className?: string;
}

export function PageHeader({title, children, className}: Props) {
  return (
    <CardBase variant="translucent" className={className}>
      <div className="flex items-center">
        <h1 className={cn(titleFont.className, 'text-2xl')}>{title}</h1>
        <div className="grow" />
        <div className="flex gap-x-2">{children}</div>
      </div>
    </CardBase>
  );
}
