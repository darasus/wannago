import {
  ComponentProps,
  ComponentType,
  forwardRef,
  Fragment,
  useState,
} from 'react';
import {Input} from '../Input/Input';
import {useFormContext, useWatch} from 'react-hook-form';
import {Form} from '../EventForm/types';
import {trpc} from '../../utils/trpc';
import {Combobox, Transition} from '@headlessui/react';
import {CheckIcon} from '@heroicons/react/24/outline';
import {useDebounce} from '../../hooks/useDebounce';
import clsx from 'clsx';
import {Card} from '../DateCard/Card/Card';

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
    const {data} = trpc.maps.searchPlaces.useQuery(
      {
        query: debouncedValue as string,
      },
      {
        enabled: !!debouncedValue,
        keepPreviousData: !!debouncedValue,
      }
    );

    return (
      <div>
        <Combobox value={selected} onChange={setSelected}>
          <div className="relative">
            <div>
              <Combobox.Input
                ref={ref}
                {...props}
                as={Input}
                autoComplete="off"
              />
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              // afterLeave={() => setQuery('')}
            >
              <Combobox.Options
                as={Card}
                className={clsx(
                  'absolute z-50 mt-1 py-1 px-0 max-h-60 w-full overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
                  {
                    hidden:
                      !data?.predictions || data?.predictions.length === 0,
                  }
                )}
              >
                {data?.predictions?.map(place => (
                  <Combobox.Option
                    key={place.place_id}
                    className={({active}) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 list-none ${
                        active ? 'bg-purple-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={place.description}
                  >
                    {({selected, active}) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {place.description}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
