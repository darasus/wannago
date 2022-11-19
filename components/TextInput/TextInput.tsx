import clsx from 'clsx';
import {forwardRef} from 'react';

interface Props extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

function TextInputWithoutRef(
  props: Props,
  ref: React.Ref<HTMLTextAreaElement>
) {
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
        <textarea
          ref={ref}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...props}
        />
      </div>
    </div>
  );
}

export const TextInput = forwardRef(TextInputWithoutRef);
