import clsx from 'clsx';
import {ButtonHTMLAttributes, PropsWithChildren} from 'react';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'link'
  | 'link-neutral';

interface Props
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function Button({
  size = 'md',
  variant = 'primary',
  children,
  ...props
}: Props) {
  // variants
  const isLink = variant === 'link';
  const isLinkNeutral = variant === 'link-neutral';
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isNeutral = variant === 'neutral';
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
      className={clsx({
        // base button styles
        'inline-flex items-center rounded border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2':
          !(isLink || isLinkNeutral),
        // base link styles
        'inline-flex items-center border-b': isLink || isLinkNeutral,
        // sizes
        'px-2.5 py-1.5 text-xs': isXs && !(isLink || isLinkNeutral),
        'px-3 py-2 text-sm': isSm && !(isLink || isLinkNeutral),
        'px-4 py-2 text-sm': isMd && !(isLink || isLinkNeutral),
        'px-4 py-2 text-base': isLg && !(isLink || isLinkNeutral),
        'px-6 py-3 text-base': isXl && !(isLink || isLinkNeutral),
        // colors
        'border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500':
          isPrimary,
        'border-transparent bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500':
          isSecondary,
        'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500':
          isNeutral,
        'text-indigo-600 hover:text-indigo-500 border-indigo-600 hover:border-indigo-500 text-sm font-medium leading-none':
          isLink,
        'text-gray-400 hover:text-gray-500 border-gray-400 hover:border-gray-500 text-sm font-medium leading-none inline':
          isLinkNeutral,
      })}
    >
      {children}
    </button>
  );
}
