'use client';

import {PropsWithChildren} from 'react';
import {Switch as _Switch} from '@headlessui/react';
import {Text} from 'ui';
import {Control, useController} from 'react-hook-form';
import {cn} from 'utils';

type Props = PropsWithChildren & {
  label?: string;
  name: string;
  defaultValue: boolean;
  control: Control<any>;
};

export function Switch({children, name, defaultValue, control}: Props) {
  const {
    field,
    fieldState: {},
  } = useController({name, control, defaultValue});

  return (
    <>
      <label htmlFor="checkbox" className="flex items-center gap-x-2">
        <_Switch
          checked={field.value}
          onChange={field.onChange}
          className={cn(
            {'bg-green-300 border-green-500': field.value},
            {'bg-white border-gray-300': !field.value},
            'h-8 w-14 md:h-7 md:w-14',
            'relative inline-flex shrink-0',
            'transition-colors duration-200 ease-in-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
            'border-2',
            'rounded-full'
          )}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={cn(
              'h-5 w-5 md:h-4 md:w-4',
              'relative top-1 left-1 pointer-events-none inline-block transform rounded-full bg-gray-50 border-2 border-gray-800 shadow-lg ring-0 transition duration-200 ease-in-out',
              {'translate-x-6': field.value},
              {'translate-x-0': !field.value}
            )}
          />
        </_Switch>
        {children && <Text className="text-gray-400">{children}</Text>}
      </label>
    </>
  );
}
