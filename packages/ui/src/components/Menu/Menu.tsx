import {Menu as _Menu, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/24/solid';
import {Fragment} from 'react';
import {Button} from '../Button/Button';
import {CardBase} from '../CardBase/CardBase';

interface Option {
  label: string;
  href: string;
  iconLeft?: JSX.Element;
}

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  options: Option[];
}

export function Menu({size = 'md', options}: Props) {
  return (
    <_Menu as="div" className="relative z-40">
      <div>
        <_Menu.Button>
          <Button size={size} iconLeft={<ChevronDownIcon />}>
            Options
          </Button>
        </_Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <_Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right">
          <CardBase className="p-4" innerClassName="flex flex-col gap-2">
            {options.map(option => (
              <_Menu.Item>
                {({active}) => (
                  <Button
                    key={option.href}
                    className="w-full justify-start"
                    size={size}
                    variant={active ? 'primary' : 'neutral'}
                    as="a"
                    href={option.href}
                  >
                    {option.label}
                  </Button>
                )}
              </_Menu.Item>
            ))}
          </CardBase>
        </_Menu.Items>
      </Transition>
    </_Menu>
  );
}
