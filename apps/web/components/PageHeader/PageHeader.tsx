import clsx from 'clsx';
import {PropsWithChildren} from 'react';
import {titleFont} from '../../fonts';
import {CardBase} from '../CardBase/CardBase';
import {Text} from '../Text/Text';

interface Props extends PropsWithChildren {
  title: string;
}

export function PageHeader({title, children}: Props) {
  return (
    <CardBase className="mb-4 border-dashed bg-transparent">
      <div className="flex items-center">
        <Text className={clsx(titleFont.className, 'text-2xl')}>{title}</Text>
        <div className="grow" />
        <div className="flex gap-x-2">{children}</div>
      </div>
    </CardBase>
  );
}
