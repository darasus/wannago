import {forwardRef, useState} from 'react';
import {useFormContext} from 'react-hook-form';
import {Form} from '../../../features/EventForm/types';
import {cn} from 'browser-utils';

interface Option {
  label: JSX.Element | string;
  value: string;
}

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  options: Option[];
}

export const EventTypeToggleInput = forwardRef<HTMLInputElement, Props>(
  function EventTypeToggleInput({options, ...props}, ref) {
    const {
      formState: {defaultValues},
      setValue,
    } = useFormContext<Form>();
    const [state, setState] = useState<string>(
      defaultValues?.type || options[0].value
    );

    return (
      <>
        <input {...props} ref={ref} className="hidden" type="text" />
        <div className="flex">
          <div className="flex h-11 rounded-full border-2 bg-white border-gray-300 sm:text-md placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500 p-1">
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
                    setValue(props?.name as 'streamUrl', option.value);
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
  }
);
