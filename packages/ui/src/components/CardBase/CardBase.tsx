import {forwardRef, PropsWithChildren} from 'react';
import {cn} from '../../../../utils';
import {LoadingBlock} from '../LoadingBlock/LoadingBlock';
import {Text} from '../Text/Text';

type Props = PropsWithChildren & {
  className?: string;
  innerClassName?: string;
  variant?: 'normal' | 'translucent';
  isBlur?: boolean;
  isLoading?: boolean;
  title?: string;
  titleChildren?: React.ReactNode;
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
    ...props
  },
  ref
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'relative',
        'p-6 rounded-3xl border-2',
        {'border-gray-800 bg-white': variant === 'normal'},
        {'border-black/10 bg-black/5': variant === 'translucent'},
        {'blur-[3px] pointer-events-none': isBlur},
        className
      )}
    >
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
