import * as React from 'react';
import type {AriaListBoxOptions} from '@react-aria/listbox';
import type {ListState} from 'react-stately';
import type {Node} from '@react-types/shared';
import {useListBox, useListBoxSection, useOption} from 'react-aria';
import {CheckIcon} from '@heroicons/react/24/outline';
import {Text} from '../Text/Text';
import {cn} from 'utils';

interface ListBoxProps extends AriaListBoxOptions<unknown> {
  listBoxRef?: React.RefObject<HTMLUListElement>;
  state: ListState<unknown>;
}

interface SectionProps {
  section: Node<unknown>;
  state: ListState<unknown>;
}

interface OptionProps {
  item: Node<unknown>;
  state: ListState<unknown>;
}

export function ListBox(props: ListBoxProps) {
  let ref = React.useRef<HTMLUListElement>(null);
  let {listBoxRef = ref, state} = props;
  let {listBoxProps} = useListBox(props, state, listBoxRef);

  return (
    <ul
      {...listBoxProps}
      ref={listBoxRef}
      className="w-full max-h-72 overflow-auto outline-none"
    >
      {[...state.collection].map(item =>
        item.type === 'section' ? (
          <ListBoxSection key={item.key} section={item} state={state} />
        ) : (
          <Option key={item.key} item={item} state={state} />
        )
      )}
    </ul>
  );
}

function ListBoxSection({section, state}: SectionProps) {
  let {itemProps, headingProps, groupProps} = useListBoxSection({
    heading: section.rendered,
    'aria-label': section['aria-label'],
  });

  return (
    <>
      <li {...itemProps} className="pt-2">
        {section.rendered && <Text {...headingProps}>{section.rendered}</Text>}
        <ul {...groupProps}>
          {[...section.childNodes].map(node => (
            <Option key={node.key} item={node} state={state} />
          ))}
        </ul>
      </li>
    </>
  );
}

function Option({item, state}: OptionProps) {
  let ref = React.useRef<HTMLLIElement>(null);
  let {optionProps, isDisabled, isSelected, isFocused} = useOption(
    {
      key: item.key,
    },
    state,
    ref
  );

  return (
    <li
      {...optionProps}
      ref={ref}
      className={cn(
        'm-1 rounded-3xl py-2 px-4 outline-none cursor-default flex items-center justify-between',
        {
          'bg-gray-100': isFocused,
          'font-bold': isSelected,
        }
      )}
    >
      <Text>{item.rendered}</Text>
      {isSelected && (
        <CheckIcon aria-hidden="true" className="w-5 h-5 text-gray-800" />
      )}
    </li>
  );
}
