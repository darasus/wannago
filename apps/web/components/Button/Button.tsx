import clsx from 'clsx';
import Link, {LinkProps} from 'next/link';
import {ButtonHTMLAttributes, forwardRef, PropsWithChildren} from 'react';
import {Spinner} from '../Spinner/Spinner';
import {ButtonSize, ButtonVariant} from './types';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  iconLeft?: React.ReactNode;
  isLoading?: boolean;
  as?: 'button' | 'label' | 'a';
  htmlFor?: string;
  href?: LinkProps['href'];
};

export const Button = forwardRef(function Button(
  {
    size = 'md',
    variant = 'primary',
    children,
    className,
    iconLeft,
    isLoading,
    as = 'button',
    ...props
  }: Props,
  ref: React.Ref<HTMLButtonElement>
) {
  // variants
  const isLink = variant === 'link' || variant === 'link-gray';
  const isLinkGray = variant === 'link-gray';
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isNeutral = variant === 'neutral';
  const isDanger = variant === 'danger';
  // icons
  const isIconButton = iconLeft && !children;
  // const isIconAndTextButton = iconLeft && children;
  // sizes
  const isXs = size === 'xs';
  const isSm = size === 'sm';
  const isMd = size === 'md';
  const isLg = size === 'lg';

  return (
    <Component
      as={as}
      ref={ref}
      type="button"
      {...props}
      className={clsx(
        'cursor-pointer justify-center shrink-0',
        // base text styles
        'text-gray-800 font-bold',
        // base borders styles
        'rounded-full border-2 border-gray-800',
        {
          // base button styles
          'inline-flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2':
            !isLink,
          // base link styles
          'border-t-0 border-l-0 border-r-0 rounded-none inline-flex items-center border-0 border-b leading-none font-normal':
            isLink,
          // sizes
          'h-6 px-2': !isIconButton && isXs && !isLink,
          'h-8 px-2': !isIconButton && isSm && !isLink,
          'h-11 px-4': !isIconButton && isMd && !isLink,
          'h-16 px-6': !isIconButton && isLg && !isLink,
          'p-2': isIconButton && (isSm || isMd || isLg) && !isLink,
          'text-xs': !isIconButton && isXs,
          'text-sm': !isIconButton && isSm,
          'text-base': !isIconButton && isMd,
          'text-md': !isIconButton && isLg,
          // colors
          'bg-brand-600 hover:bg-brand-500 focus:ring-brand-1000': isPrimary,
          'bg-brand-100 hover:bg-brand-200 focus:ring-brand-500': isSecondary,
          'text-gray-50 bg-red-600 hover:bg-red-700 focus:ring-red-500':
            isDanger,
          'bg-gray-50 hover:bg-gray-200 focus:ring-brand-500': isNeutral,
          '!text-gray-500 !border-gray-500 hover:!text-gray-800 hover:!border-gray-800':
            isLinkGray,
        },
        className
      )}
    >
      {isLoading ? (
        <Spinner
          className={clsx({
            'h-4 w-4': isXs,
            'h-5 w-5': isSm,
            'h-6 w-6': isMd || isLg,
          })}
        />
      ) : (
        <>
          {
            (iconLeft &&= (
              <div
                className={clsx(
                  'text-gray-800',
                  {
                    'h-4 w-4': isXs,
                    'h-5 w-5': isSm,
                    'h-6 w-6': isMd || isLg,
                  },
                  {'mr-2': !!children}
                )}
              >
                {iconLeft}
              </div>
            ))
          }
          {children}
        </>
      )}
    </Component>
  );
});

const Component = forwardRef(function Component(
  {as, children, ...props}: any,
  ref: any
) {
  if (as === 'label') {
    return (
      <label ref={ref} {...props}>
        {children}
      </label>
    );
  }

  if (as === 'a') {
    return (
      <Link ref={ref} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} {...props}>
      {children}
    </button>
  );
});
