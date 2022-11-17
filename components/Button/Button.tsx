import clsx from 'clsx';
import {ButtonHTMLAttributes, PropsWithChildren} from 'react';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'link'
  | 'link-neutral';

const sizeMap: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2 text-base',
  xl: 'px-6 py-3 text-base',
};

const variantMap: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
  secondary:
    'border-transparent bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500',
  neutral:
    'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
  link: 'text-indigo-600 hover:text-indigo-500 border-indigo-600 hover:border-indigo-500 text-sm font-medium leading-none',
  'link-neutral':
    'text-gray-400 hover:text-gray-500 border-gray-400 hover:border-gray-500 text-sm font-medium leading-none inline',
};

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
  const isLink = variant.startsWith('link');

  return (
    <button
      type="button"
      {...props}
      className={clsx(
        {
          ['inline-flex items-center rounded border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2']:
            !isLink,
        },
        {
          ['inline-flex items-center border-b-2']: isLink,
        },
        {[sizeMap[size]]: !isLink},
        variantMap[variant]
      )}
    >
      {children}
    </button>
  );
}
