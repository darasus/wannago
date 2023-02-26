import {PropsWithChildren} from 'react';
import {titleFont} from '../../../../../apps/web/fonts';
import {cn} from 'browser-utils';
import {CardBase} from '../CardBase/CardBase';
import {Text} from '../Text/Text';

interface Props extends PropsWithChildren {
  title: string;
  className?: string;
}

export function PageHeader({title, children, className}: Props) {
  return (
    <CardBase variant="translucent" className={className}>
      <div className="flex items-center">
        <Text className={cn(titleFont.className, 'text-2xl')}>{title}</Text>
        <div className="grow" />
        <div className="flex gap-x-2">{children}</div>
      </div>
    </CardBase>
  );
}
