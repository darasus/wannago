'use client';

import {ComponentType, forwardRef, Fragment, useState} from 'react';
import {Input} from '../Input/Input';
import {useFormContext, useWatch} from 'react-hook-form';
import {Form} from '../../../features/EventForm/types';
import {Combobox, Transition} from '@headlessui/react';
import {CheckIcon} from '@heroicons/react/24/solid';
import {useDebounce} from 'hooks';
import {CardBase} from 'ui';
import {cn} from 'utils';
import {api} from '../../../trpc/client';
import {useQuery} from '@tanstack/react-query';

type ExtractProps<T> = T extends ComponentType<infer P> ? P : T;

type Props = ExtractProps<typeof Combobox.Input>;

export const LocationInput = forwardRef<HTMLInputElement, Props>(
  function LocationInputFileInput(props, ref) {
    const {
      formState: {defaultValues},
      control,
    } = useFormContext<Form>();
    const [selected, setSelected] = useState(defaultValues?.address);
    const address = useWatch<Form>({
      control,
      name: 'address',
    });
    const debouncedValue = useDebounce(address);
    const {data, isFetching} = useQuery({
      queryKey: ['searchPlaces', debouncedValue],
      queryFn: () =>
        api.maps.searchPlaces.query({
          query: debouncedValue,
        }),
      enabled: Boolean(debouncedValue),
    });

    return (
      <div>
        <Combobox value={selected} onChange={setSelected}>
          <div>
            <div>
              <Combobox.Input
                ref={ref}
                {...props}
                as={Input}
                autoComplete="off"
                isLoading={isFetching}
              />
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Combobox.Options
                as={CardBase}
                className={cn(
                  'absolute z-50 mt-1 !p-0 py-1 px-0 max-h-60 w-full overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none text-md',
                  {
                    hidden:
                      !data?.predictions || data?.predictions.length === 0,
                  }
                )}
              >
                {data?.predictions?.map(place => (
                  <Combobox.Option
                    key={place.place_id}
                    data-testid="location-input-option"
                    className={({active}) =>
                      `relative cursor-default select-none py-2 px-4 list-none ${
                        active ? 'bg-brand-400 text-gray-50' : 'text-gray-700'
                      }`
                    }
                    value={place.description}
                  >
                    {({selected, active}) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-bold' : 'font-normal'
                          }`}
                        >
                          {place.description}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-gray-800' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    );
  }
);
