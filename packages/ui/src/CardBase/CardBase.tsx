import {forwardRef, PropsWithChildren, ReactNode} from 'react';
import {cn} from 'utils';
import {LoadingBlock} from '../LoadingBlock/LoadingBlock';
import {BadgeWithModal} from '../BadgeWithModal/BadgeWithModal';
import {Card} from '../Card/Card';

interface BadgeItem {
  label: React.ReactNode;
  content: React.ReactNode;
  color: 'green' | 'red' | 'blue' | 'yellow';
}

type Props = PropsWithChildren & {
  className?: string;
  innerClassName?: string;
  isLoading?: boolean;
  title?: ReactNode;
  titleChildren?: React.ReactNode;
  badge?: BadgeItem;
};

export const CardBase = forwardRef<HTMLDivElement, Props>(function CardBase(
  {
    children,
    className,
    innerClassName,
    isLoading,
    title,
    titleChildren = null,
    badge,
    ...props
  },
  ref
) {
  return (
    <Card ref={ref} {...props} className={cn('relative', className)}>
      {title && (
        <div className="flex items-center gap-2 bg-muted rounded-t-xl border-b border-foreground/5">
          <div
            className={cn(
              {'border-r': !!titleChildren},
              'border-foreground/5 bg-muted p-2 pl-4 text-sm rounded-tl-xl font-bold uppercase shrink overflow-hidden'
            )}
          >
            {title}
          </div>
          <div className="flex items-center grow shrink-0 mr-4">
            {titleChildren}
          </div>
        </div>
      )}
      {badge && (
        <div className="flex justify-center items-center gap-1 shrink-0 absolute left-0 right-0 top-0 mx-auto -translate-y-[50%]">
          <BadgeWithModal text={badge.content} color={badge.color}>
            {badge.label}
          </BadgeWithModal>
        </div>
      )}
      <div className={cn('p-6', innerClassName)}>{children}</div>
      <div
        className={cn(
          'absolute top-0 bottom-0 left-0 right-0',
          'flex items-center justify-center',
          'bg-white opacity-0 rounded-md z-10 pointer-events-none',
          'transition-opacity duration-300',
          {'opacity-100 pointer-events-auto': isLoading}
        )}
      >
        <LoadingBlock />
      </div>
    </Card>
  );
});
