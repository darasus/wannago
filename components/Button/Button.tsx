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
  const isLink = variant === 'link';
  const isLinkNeutral = variant === 'link-neutral';
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isNeutral = variant === 'neutral';
  const isDanger = variant === 'danger';
  // icons
  const isIconButton = iconLeft && !children;
  const isIconAndTextButton = iconLeft && children;
  // sizes
  const isXs = size === 'xs';
  const isSm = size === 'sm';
  const isMd = size === 'md';
  const isLg = size === 'lg';
  const isXl = size === 'xl';

  return (
    <Component
      as={as}
      ref={ref}
      type="button"
      {...props}
      className={clsx(
        'cursor-pointer',
        {
          // base button styles
          'inline-flex items-center rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2':
            !(isLink || isLinkNeutral),
          // base link styles
          'inline-flex items-center border-b': isLink || isLinkNeutral,
          // sizes
          'px-2.5 py-1.5 text-xs':
            !isIconButton && isXs && !(isLink || isLinkNeutral),
          'px-3 py-2 text-sm':
            !isIconButton && isSm && !(isLink || isLinkNeutral),
          'px-4 py-2 text-sm':
            !isIconButton && isMd && !(isLink || isLinkNeutral),
          'px-4 py-2 text-base':
            !isIconButton && isLg && !(isLink || isLinkNeutral),
          'px-6 py-3 text-base':
            !isIconButton && isXl && !(isLink || isLinkNeutral),
          'p-1.5': isIconButton && isXs && !(isLink || isLinkNeutral),
          'p-2':
            isIconButton &&
            (isSm || isMd || isLg) &&
            !(isLink || isLinkNeutral),
          'p-3': isIconButton && isXl && !(isLink || isLinkNeutral),
          // colors
          'border-transparent bg-brand-900 text-white hover:bg-brand-1000 focus:ring-brand-1000 font-bold':
            isPrimary,
          'border-transparent bg-brand-100 text-brand-800 hover:bg-brand-200 focus:ring-brand-500 font-bold':
            isSecondary,
          'border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 font-bold':
            isDanger,
          'border-gray-100 bg-white text-gray-800 hover:bg-gray-50 focus:ring-brand-500':
            isNeutral,
          'text-brand-600 hover:text-brand-500 border-brand-600 hover:border-brand-500 text-sm font-medium leading-none':
            isLink,
          'text-gray-400 hover:text-gray-500 border-gray-400 hover:border-gray-500 text-sm font-medium leading-none inline':
            isLinkNeutral,
        },
        className
      )}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {children}
          {iconLeft || ''}
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
