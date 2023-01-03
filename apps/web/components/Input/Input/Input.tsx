import {InputWrapper} from './InputWrapper';
import clsx from 'clsx';
import {forwardRef} from 'react';
import {FieldError} from 'react-hook-form';
import {Spinner} from '../../Spinner/Spinner';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  inputClassName?: string;
  containerClassName?: string;
  error?: FieldError;
  isLoading?: boolean;
}

export const Input = forwardRef(function Input(
  {containerClassName, inputClassName, error, isLoading, ...props}: Props,
  ref: React.Ref<HTMLInputElement>
) {
  const hasError = Boolean(error);

  return (
    <InputWrapper
      containerClassName={containerClassName}
      error={error}
      id={props.id}
      label={props.label}
    >
      <input
        data-tooltip-target="tooltip-default"
        type="text"
        className={clsx(
          'block w-full rounded-full border-2 border-gray-300 sm:text-md',
          {'focus:border-gray-500 focus:ring-gray-500': !hasError},
          inputClassName,
          {
            ['border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 pr-10']:
              hasError,
          }
        )}
        {...props}
        ref={ref}
      />
      {isLoading && (
        <div className="absolute top-0 bottom-0 right-4 flex items-center">
          <Spinner />
        </div>
      )}
    </InputWrapper>
  );
});
