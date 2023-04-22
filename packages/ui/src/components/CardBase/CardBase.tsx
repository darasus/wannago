import {forwardRef, PropsWithChildren} from 'react';
import {cn} from '../../../../utils';
import {LoadingBlock} from '../LoadingBlock/LoadingBlock';
import {Text} from '../Text/Text';

interface BadgeItem {
  badgeContent: React.ReactNode;
  badgeColor: 'green' | 'gray' | 'yellow' | 'white';
}

type Props = PropsWithChildren & {
  className?: string;
  innerClassName?: string;
  variant?: 'normal' | 'translucent';
  isBlur?: boolean;
  isLoading?: boolean;
  title?: string;
  titleChildren?: React.ReactNode;
  badges?: BadgeItem[];
};

export const CardBase = forwardRef<HTMLDivElement, Props>(function Card(
  {
    children,
    className,
    variant = 'normal',
    isBlur,
    innerClassName,
    isLoading,
    title,
    titleChildren = null,
    badges,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        'relative',
        'p-6 rounded-3xl border-2',
        {'border-gray-800 bg-white': variant === 'normal'},
        {'border-black/10 bg-black/5': variant === 'translucent'},
        {'blur-[3px] pointer-events-none': isBlur},
        className
      )}
    >
      {badges && (
        <div className="flex justify-center items-center gap-1 absolute left-0 right-0 top-0 mx-auto -translate-y-[50%]">
          {badges.map(({badgeColor, badgeContent}, index) => (
            <div
              key={index}
              className={cn(
                'flex justify-center items-center border-2 border-gray-800 rounded-3xl px-1 py-[1px]',
                {
                  'bg-green-300': badgeColor === 'green',
                  'bg-white': badgeColor === 'white',
                  'bg-yellow-300': badgeColor === 'yellow',
                }
              )}
            >
              <Text className="-mb-[1px]">{badgeContent}</Text>
            </div>
          ))}
        </div>
      )}
      {title && (
        <div className="flex items-center mb-2 gap-x-2">
          <Text className="font-bold">{title}</Text>
          {titleChildren}
        </div>
      )}
      <div
        className={cn(
          {'blur-[3px] pointer-events-none': isBlur},
          innerClassName
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          'absolute top-0 bottom-0 left-0 right-0',
          'flex items-center justify-center',
          'bg-white opacity-0 rounded-3xl z-10 pointer-events-none',
          'transition-opacity duration-300',
          {'opacity-100 pointer-events-auto': isLoading}
        )}
      >
        <LoadingBlock />
      </div>
    </div>
  );
});
