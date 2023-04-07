import {forwardRef, useState} from 'react';
import {cn} from 'utils';

interface Option {
  label: JSX.Element | string;
  value: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange?: (value: string) => void;
}

export function Toggle({options, onChange, value}: Props) {
  const [state, setState] = useState<string>(value || options[0].value);

  return (
    <>
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
                  onChange?.(option.value);
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
