import {
  ArrowLeftIcon,
  BackspaceIcon,
  BackwardIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/solid';
import {PropsWithChildren} from 'react';
import {titleFont} from '../../../../../apps/web/src/fonts';
import {cn} from '../../../../utils';
import {Button} from '../Button/Button';
import {CardBase} from '../CardBase/CardBase';

interface Props extends PropsWithChildren {
  title: string;
  className?: string;
  back?: () => void;
}

export function PageHeader({title, children, className, back}: Props) {
  return (
    <CardBase className={className}>
      <div className="flex items-center flex-row gap-2">
        <div className="flex items-center gap-2 md:gap-4">
          {back && (
            <Button
              className="hidden md:visible"
              size="sm"
              iconLeft={<ChevronLeftIcon />}
              onClick={back}
            />
          )}
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
