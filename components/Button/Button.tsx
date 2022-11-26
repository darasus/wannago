import clsx from 'clsx';
import {ButtonHTMLAttributes, PropsWithChildren} from 'react';
import {ButtonSize, ButtonVariant} from './types';

interface Props
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  iconLeft?: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  size = 'md',
  variant = 'primary',
  children,
  className,
  iconLeft,
  isLoading,
  ...props
}: Props) {
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
    <button
      type="button"
      {...props}
      className={clsx(
        {
          // base button styles
          'inline-flex items-center rounded border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2':
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
          'border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500':
            isPrimary,
          'border-transparent bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500':
            isSecondary,
          'border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500':
            isDanger,
          'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500':
            isNeutral,
          'text-indigo-600 hover:text-indigo-500 border-indigo-600 hover:border-indigo-500 text-sm font-medium leading-none':
            isLink,
          'text-gray-400 hover:text-gray-500 border-gray-400 hover:border-gray-500 text-sm font-medium leading-none inline':
            isLinkNeutral,
        },
        className
      )}
    >
      {isLoading ? (
        <svg
          className="animate-spin block h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <>
          {children}
          {iconLeft || ''}
        </>
      )}
    </button>
  );
}
