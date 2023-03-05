import {ExclamationCircleIcon} from '@heroicons/react/24/solid';
import {PropsWithChildren} from 'react';
import {FieldError} from 'react-hook-form';
import {Badge} from 'ui';
import {cn} from 'utils';

interface Props extends PropsWithChildren {
  label?: string;
  containerClassName?: string;
  error?: FieldError;
  id?: string;
  isOptional?: boolean;
}

export function InputWrapper({
  containerClassName,
  error,
  label,
  id,
  children,
  isOptional,
}: Props) {
  const hasError = Boolean(error);

  return (
    <div className={cn(containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'flex items-center text-md text-gray-800 mb-1 ml-2 font-bold'
          )}
        >
          {label}
          {isOptional && (
            <Badge size="xxs" className="ml-1 mt-[2px]">
              Optional
            </Badge>
          )}
        </label>
      )}
      <div className={cn({'mt-1': !!id})}>
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
