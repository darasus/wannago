import {InputWrapper} from './InputWrapper';
import clsx from 'clsx';
import {forwardRef} from 'react';
import {FieldError} from 'react-hook-form';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  inputClassName?: string;
  containerClassName?: string;
  error?: FieldError;
}

export const Textarea = forwardRef(function Input(
  {containerClassName, inputClassName, error, ...props}: Props,
  ref: React.Ref<HTMLTextAreaElement>
) {
  const hasError = Boolean(error);

  return (
    <InputWrapper
      containerClassName={containerClassName}
      error={error}
      id={props.id}
      label={props.label}
    >
      <textarea
        data-tooltip-target="tooltip-default"
        className={clsx(
          'block w-full rounded-md border-gray-300 shadow-sm sm:text-sm',
          {'focus:border-brand-500 focus:ring-brand-500': !hasError},
          inputClassName,
          {
            ['border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 pr-10']:
              hasError,
          }
        )}
        {...props}
        ref={ref}
      />
    </InputWrapper>
  );
});
