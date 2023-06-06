import {InputWrapper} from 'ui';
import {forwardRef} from 'react';
import {FieldError} from 'react-hook-form';
import {cn} from 'utils';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  inputClassName?: string;
  containerClassName?: string;
  error?: FieldError;
  isOptional?: boolean;
}

export const Textarea = forwardRef(function Input(
  {containerClassName, inputClassName, error, isOptional, ...props}: Props,
  ref: React.Ref<HTMLTextAreaElement>
) {
  const hasError = Boolean(error);

  return (
    <InputWrapper
      containerClassName={containerClassName}
      isOptional={isOptional}
      error={error}
      id={props.id}
      label={props.label}
    >
      <textarea
        data-tooltip-target="tooltip-default"
        className={cn(
          'block w-full rounded-3xl border-2 border-gray-300 shadow-sm sm:text-md placeholder-gray-400',
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
    </InputWrapper>
  );
});
