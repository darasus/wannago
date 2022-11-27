import clsx from 'clsx';
import {forwardRef} from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  inputClassName?: string;
  containerClassName?: string;
}

function InputWithoutRef(
  {containerClassName, inputClassName, ...props}: Props,
  ref: React.Ref<HTMLInputElement>
) {
  return (
    <div className={clsx(containerClassName)}>
      {props.label && (
        <label
          htmlFor={props.id}
          className={clsx('block text-md text-black mb-1 ml-2 font-bold')}
        >
          {props.label}
        </label>
      )}
      <div className={clsx({'mt-1': props.id})}>
        <input
          type="text"
          className={clsx(
            'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
            inputClassName
          )}
          {...props}
          ref={ref}
        />
      </div>
    </div>
  );
}

export const Input = forwardRef(InputWithoutRef);
