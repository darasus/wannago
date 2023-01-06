import {
  forwardRef,
  InputHTMLAttributes,
  PropsWithChildren,
  useState,
} from 'react';
import {Switch as _Switch} from '@headlessui/react';
import clsx from 'clsx';
import {Text} from '../../Text/Text';

type Props = PropsWithChildren &
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
  };

export const Switch = forwardRef<HTMLInputElement, Props>(function Switch(
  {children, defaultChecked, onChange, ...props},
  ref
) {
  const [enabled, setEnabled] = useState(defaultChecked || false);

  return (
    <>
      <label
        htmlFor="checkbox"
        className="flex items-center gap-x-2 cursor-pointer"
      >
        <_Switch
          checked={enabled}
          onChange={setEnabled}
          className={clsx(
            'pointer-events-none',
            {'bg-green-300': enabled},
            {'bg-gray-200': !enabled},
            'relative inline-flex h-9 w-16 shrink-0 cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75',
            'border-2 border-slate-800',
            'rounded-full'
          )}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={clsx(
              'relative top-1 left-1 pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
              {'translate-x-7': enabled},
              {'translate-x-0': !enabled}
            )}
          />
        </_Switch>
        {children && <Text className="text-gray-400">{children}</Text>}
      </label>
      <input
        ref={ref}
        type="checkbox"
        {...props}
        className="hidden"
        id={'checkbox'}
        onChange={e => {
          onChange?.(e);
          setEnabled(!enabled);
        }}
      />
    </>
  );
});
