import clsx from 'clsx';
import {forwardRef} from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

function InputWithoutRef(props: Props, ref: React.Ref<HTMLInputElement>) {
  return (
    <div>
      {props.label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700"
        >
          {props.label}
        </label>
      )}
      <div className={clsx({'mt-1': props.id})}>
        <input
          type="text"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...props}
          ref={ref}
        />
      </div>
    </div>
  );
}

export const Input = forwardRef(InputWithoutRef);
