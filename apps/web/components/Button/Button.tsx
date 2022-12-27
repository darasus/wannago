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
  // const isIconAndTextButton = iconLeft && children;
  // sizes
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
        'cursor-pointer justify-center',
        // base text styles
        'text-slate-800 font-bold',
        // base borders styles
        'rounded-full border-2 border-slate-800',
        {
          // base button styles
          'inline-flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2':
            !(isLink || isLinkNeutral),
          // base link styles
          'border-t-0 border-l-0 border-r-0 rounded-none inline-flex items-center border-b':
            isLink || isLinkNeutral,
          // sizes
          'px-2 py-1 text-sm':
            !isIconButton && isSm && !(isLink || isLinkNeutral),
          'px-4 py-2 text-base':
            !isIconButton && isMd && !(isLink || isLinkNeutral),
          'px-6 py-4 text-md':
            !isIconButton && isLg && !(isLink || isLinkNeutral),
          'p-2':
            isIconButton &&
            (isSm || isMd || isLg) &&
            !(isLink || isLinkNeutral),
          // colors
          'bg-brand-600 hover:bg-brand-500 focus:ring-brand-1000': isPrimary,
          'bg-brand-100 hover:bg-brand-200 focus:ring-brand-500': isSecondary,
          'text-gray-50 bg-red-600 hover:bg-red-700 focus:ring-red-500':
            isDanger,
          'bg-gray-50 hover:bg-gray-200 focus:ring-brand-500': isNeutral,
          'text-brand-100 border-brand-100 hover:border-brand-500 text-sm leading-none':
            isLink,
          'border-b-2 border-b-gray-400 hover:border-gray-500 text-gray-400 hover:text-gray-500 text-sm leading-none inline':
            isLinkNeutral,
        },
        className
      )}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {
            (iconLeft &&= (
              <div className={clsx({'mr-2': !!children})}>{iconLeft}</div>
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
