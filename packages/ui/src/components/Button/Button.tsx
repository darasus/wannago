import Link, {LinkProps} from 'next/link';
import {ButtonHTMLAttributes, forwardRef, PropsWithChildren} from 'react';
import {cn} from '../../../../utils';
import {Spinner} from '../Spinner/Spinner';
import {ButtonSize, ButtonVariant} from './types';
import {cva} from 'class-variance-authority';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  iconLeft?: React.ReactNode;
  isLoading?: boolean;
  as?: 'button' | 'label' | 'a';
  htmlFor?: string;
  href?: LinkProps['href'];
  target?: '_blank';
};

const button = cva(
  [
    'cursor-pointer truncate',
    // base text styles
    'text-gray-800 font-bold',
    // base borders styles
    'rounded-full border-2 border-gray-800',
    'disabled:opacity-50 disabled:pointer-events-none',
  ],
  {
    variants: {
      intent: {
        primary: [
          'text-slate-50 bg-brand-500 hover:bg-brand-600 focus:ring-brand-1000',
        ],
        secondary: [
          'text-slate-50 bg-brand-100 hover:bg-brand-200 focus:ring-brand-500',
        ],
        success: [
          'text-gray-50 bg-green-600 hover:bg-green-700 focus:ring-green-500',
        ],
        danger: [
          'text-red-500 bg-gray-50 hover:bg-gray-200 focus:ring-brand-500',
        ],
        neutral: ['bg-gray-50 hover:bg-gray-200 focus:ring-brand-500'],
        link: [],
        'link-gray': [
          'text-gray-400 !border-gray-400 hover:text-gray-800 hover:!border-gray-800',
        ],
      },
      size: {
        xs: ['text-xs'],
        sm: ['text-sm'],
        md: ['text-base'],
        lg: ['text-md'],
      },
      hasChildren: {yes: ['gap-x-2'], no: []},
    },
    compoundVariants: [
      {
        intent: ['primary', 'secondary', 'neutral', 'danger', 'success'],
        class:
          'inline-flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2',
      },
      {
        intent: ['link', 'link-gray'],
        class:
          'inline border-t-0 border-l-0 border-r-0 rounded-none border-0 border-b-2 leading-none font-bold',
      },
      {
        intent: ['primary', 'secondary', 'neutral', 'danger', 'success'],
        size: 'xs',
        class: 'h-6 px-2',
      },
      {
        intent: ['primary', 'secondary', 'neutral', 'danger', 'success'],
        size: 'sm',
        class: 'h-8 px-2',
      },
      {
        intent: ['primary', 'secondary', 'neutral', 'danger', 'success'],
        size: 'md',
        class: 'h-11 px-4',
      },
      {
        intent: ['primary', 'secondary', 'neutral', 'danger', 'success'],
        size: 'lg',
        class: 'h-16 px-6',
      },
    ],
  }
);

const icon = cva(['text-gray-800'], {
  variants: {
    intent: {
      primary: ['text-gray-50'],
      secondary: ['text-gray-50'],
      success: ['text-gray-50'],
      danger: ['text-red-500'],
      neutral: [],
      link: [],
      'link-gray': ['text-gray-400'],
    },
    size: {
      xs: ['h-4 w-4'],
      sm: ['h-5 w-5'],
      md: ['h-6 w-6'],
      lg: ['h-6 w-6'],
    },
  },
  compoundVariants: [],
});

export const Button = forwardRef(function Button(
  {
    size = 'md',
    variant = 'primary',
    children,
    className,
    iconLeft,
    isLoading,
    as = 'button',
    disabled,
    ...props
  }: Props,
  ref: React.Ref<HTMLButtonElement>
) {
  const isXs = size === 'xs';
  const isSm = size === 'sm';
  const isMd = size === 'md';
  const isLg = size === 'lg';

  return (
    <Component
      as={as}
      ref={ref}
      type="button"
      disabled={disabled || isLoading}
      {...props}
      className={cn(
        button({intent: variant, size, hasChildren: !!children ? 'yes' : 'no'}),
        className
      )}
    >
      {isLoading ? (
        <Spinner
          className={cn({
            'h-4 w-4': isXs,
            'h-5 w-5': isSm,
            'h-6 w-6': isMd || isLg,
          })}
        />
      ) : (
        <>
          {
            (iconLeft &&= (
              <div className={cn(icon({intent: variant, size}))}>
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
