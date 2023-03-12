import {forwardRef, useState} from 'react';
import {useFormContext} from 'react-hook-form';
import {cn} from 'utils';

interface Option {
  label: JSX.Element | string;
  value: string;
}

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  options: Option[];
}

export const Toggle = forwardRef<HTMLInputElement, Props>(function Toggle(
  {options, ...props},
  ref
) {
  const {formState, setValue} = useFormContext();
  const [state, setState] = useState<string>(
    formState.defaultValues?.[props.name!] || options[0].value
  );

  return (
    <>
      <input {...props} ref={ref} className="hidden" type="text" />
      <div className="flex">
        <div className="flex h-11 rounded-full border-2 bg-white border-gray-800 sm:text-md placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500 p-1">
          {options.map(option => {
            const isActive = state === option.value;
            return (
              <button
                key={option.value}
                className={cn('rounded-full py-1 px-2.5 font-bold text-sm', {
                  'bg-brand-500': isActive,
                  'text-gray-50': !isActive,
                })}
                onClick={e => {
                  setState(option.value);
                  setValue(props?.name!, option.value);
                  e.preventDefault();
                }}
                data-testid={`grouped-toggle-${option.value}`}
              >
                <div
                  className={cn(
                    {'text-gray-700': !isActive},
                    {'text-gray-50': isActive}
                  )}
                >
                  {option.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
});
