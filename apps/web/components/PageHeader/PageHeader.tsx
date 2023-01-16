import {PropsWithChildren} from 'react';
import {titleFont} from '../../fonts';
import {cn} from '../../utils/cn';
import {CardBase} from '../CardBase/CardBase';
import {Text} from '../Text/Text';

interface Props extends PropsWithChildren {
  title: string;
}

export function PageHeader({title, children}: Props) {
  return (
    <CardBase variant="translucent">
      <div className="flex items-center">
        <Text className={cn(titleFont.className, 'text-2xl')}>{title}</Text>
        <div className="grow" />
        <div className="flex gap-x-2">{children}</div>
      </div>
    </CardBase>
  );
}
