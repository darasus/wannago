import {ExclamationCircleIcon} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import {PropsWithChildren} from 'react';
import {FieldError} from 'react-hook-form';

interface Props extends PropsWithChildren {
  label?: string;
  containerClassName?: string;
  error?: FieldError;
  id?: string;
}

export function InputWrapper({
  containerClassName,
  error,
  label,
  id,
  children,
}: Props) {
  const hasError = Boolean(error);

  return (
    <div className={clsx(containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={clsx('block text-md text-slate-800 mb-1 ml-2 font-bold')}
        >
          {label}
        </label>
      )}
      <div className={clsx({'mt-1': !!id})}>
        <div className="relative">
          {children}
          {hasError && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {hasError && (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {error?.message}
          </p>
        )}
      </div>
    </div>
  );
}
