import {ExclamationCircleIcon} from '@heroicons/react/24/solid';
import {PropsWithChildren} from 'react';
import {FieldError} from 'react-hook-form';
import {Badge, Text} from 'ui';
import {cn} from 'utils';

interface Props extends PropsWithChildren {
  label?: string;
  description?: string;
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
  description,
}: Props) {
  const hasError = Boolean(error);

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <div>
          <label
            htmlFor={id}
            className={cn(
              'flex items-center text-md text-gray-800 ml-2 font-bold'
            )}
          >
            {label}
            {isOptional && (
              <Badge size="xxs" className="ml-1 mt-[2px]">
                Optional
              </Badge>
            )}
          </label>
          {description && (
            <Text className="text-gray-400 text-sm ml-2">{description}</Text>
          )}
        </div>
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
