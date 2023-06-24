import * as React from 'react';
import type {AriaSelectProps} from '@react-types/select';
import {useSelectState} from 'react-stately';
import {
  useSelect,
  HiddenSelect,
  useButton,
  mergeProps,
  useFocusRing,
} from 'react-aria';
import {ChevronDownIcon} from '@heroicons/react/24/solid';
import {ListBox} from './ListBox';
import {cva} from 'class-variance-authority';
import {InputWrapper, InputWrapperProps} from '../InputWrapper/InputWrapper';
import {cn} from 'utils';
import {ButtonSize} from '../Button/types';
import {Text} from '../Text/Text';
import {Popover} from './Popover';

export {Item as SelectItem} from 'react-stately';

const select = cva(
  [
    'relative',
    'cursor-pointer',
    // base text styles
    'text-gray-800 font-bold',
    // base borders styles
    'rounded-full border-2 border-gray-800',
    'disabled:opacity-50 disabled:pointer-events-none',
  ],
  {
    variants: {
      size: {
        xs: ['text-xs'],
        sm: ['text-sm'],
        md: ['text-base'],
        lg: ['text-md'],
      },
    },
    compoundVariants: [
      {
        size: 'xs',
        class: 'gap-x-1',
      },
      {
        size: ['sm', 'md', 'lg'],
        class: 'gap-x-2',
      },
      {
        size: 'xs',
        class: 'h-6 px-2',
      },
      {
        size: 'sm',
        class: 'h-8 px-2',
      },
      {
        size: 'md',
        class: 'h-11 px-4',
      },
      {
        size: 'lg',
        class: 'h-16 px-6',
      },
    ],
  }
);

export function Select<T extends object>(
  props: AriaSelectProps<T> &
    InputWrapperProps & {size?: ButtonSize; className?: string}
) {
  // Create state based on the incoming props
  let state = useSelectState(props);

  // Get props for child elements from useSelect
  let ref = React.useRef(null);
  let {labelProps, triggerProps, valueProps, menuProps} = useSelect(
    props,
    state,
    ref
  );

  // Get props for the button based on the trigger props from useSelect
  let {buttonProps} = useButton(triggerProps, ref);

  let {focusProps, isFocusVisible} = useFocusRing();

  return (
    <InputWrapper
      label={props.label}
      description={props.description}
      error={props.error}
      containerClassName={cn('inline-flex', props.className)}
    >
      <HiddenSelect
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name}
      />
      <button
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        className={cn(
          `w-full relative flex flex-row items-center justify-between rounded-3xl overflow-hidden border-2 outline-none`,
          select({
            size: props.size || 'md',
          }),
          {
            'border-brand-100': isFocusVisible,
            'border-gray-300': !isFocusVisible,
            'bg-gray-100': state.isOpen,
            'bg-white': !state.isOpen,
          }
        )}
      >
        <Text {...valueProps}>
          {state.selectedItem ? state.selectedItem.rendered : 'Select option'}
        </Text>
        <ChevronDownIcon
          className={cn('w-5 h-5', {
            'border-brand-100': isFocusVisible,
            'text-gray-500': !isFocusVisible,
          })}
        />
      </button>
      {state.isOpen && (
        <Popover
          state={state}
          triggerRef={ref}
          placement="bottom end"
          className="w-52"
        >
          <ListBox {...menuProps} state={state} />
        </Popover>
      )}
    </InputWrapper>
  );
}
