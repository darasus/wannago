import {Menu as _Menu, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/24/solid';
import {ComponentProps, Fragment, FunctionComponent} from 'react';
import {Button} from '../Button/Button';
import {CardBase} from '../CardBase/CardBase';

interface Option {
  label: string;
  href?: string;
  onClick?: () => void;
  iconLeft?: JSX.Element;
  variant?: 'neutral' | 'danger' | 'primary' | 'secondary' | 'success';
}

interface Props {
  activeHref?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  options: Option[];
  testId?: string;
  as?: FunctionComponent<ComponentProps<typeof Button>>;
}

export function Menu({size = 'md', options, activeHref, testId, as}: Props) {
  return (
    <_Menu as="div" className="relative">
      <div>
        <_Menu.Button
          as={as || Button}
          size={size}
          iconLeft={<ChevronDownIcon />}
          data-testid={testId || 'select-button'}
        >
          {(activeHref &&
            options.find(option => option.href?.startsWith(activeHref))
              ?.label) ||
            'Select'}
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
        <_Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right z-[9999]">
          <CardBase className="p-4" innerClassName="flex flex-col gap-2">
            {options.map(option => (
              <_Menu.Item key={option.label}>
                {({close}) => {
                  return (
                    <Button
                      className="w-full justify-start"
                      size={size}
                      as={option.href ? 'a' : undefined}
                      href={option.href}
                      variant={option?.variant || 'neutral'}
                      onClick={() => {
                        option.onClick?.();
                        close();
                      }}
                      data-testid="select-option-button"
                      iconLeft={option.iconLeft}
                    >
                      {option.label}
                    </Button>
                  );
                }}
              </_Menu.Item>
            ))}
          </CardBase>
        </_Menu.Items>
      </Transition>
    </_Menu>
  );
}
