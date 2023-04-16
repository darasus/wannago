import {Fragment} from 'react';
import {Popover, Transition} from '@headlessui/react';
import {Button, CardBase} from 'ui';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {Bars3Icon} from '@heroicons/react/24/solid';
import {navItems} from './constants';
import {useAuth} from '@clerk/nextjs';

export function MobileMenu() {
  const auth = useAuth();
  const showAuthButtons = auth.isLoaded && !auth.isSignedIn;

  return (
    <div className="-mr-1 md:hidden">
      <Popover>
        <Popover.Button data-testid="mobile-nav-button" as={Fragment}>
          {({open}) => (
            <Button
              iconLeft={open ? <XMarkIcon /> : <Bars3Icon />}
              variant="neutral"
            />
          )}
        </Popover.Button>
        <Transition.Root className="z-10">
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              as={CardBase}
              className="absolute z-50 inset-x-0 top-20 flex origin-top flex-col tracking-tight -mx-4"
            >
              <div className="flex flex-col items-start gap-y-2">
                {navItems.map((item, i) => (
                  <Button key={i} as="a" variant="neutral" href={item.href}>
                    {item.label}
                  </Button>
                ))}
              </div>
              {showAuthButtons && (
                <>
                  <hr className="my-2 border-[1px] border-gray-800" />
                  <div className="flex gap-x-2">
                    <Button
                      as="a"
                      variant="secondary"
                      data-testid="mobile-login-button"
                      href={'/login'}
                    >
                      Login
                    </Button>
                    <Button
                      as="a"
                      variant="primary"
                      data-testid="mobile-register-button"
                      href={'/register'}
                    >
                      Register
                    </Button>
                  </div>
                </>
              )}
            </Popover.Panel>
          </Transition.Child>
        </Transition.Root>
      </Popover>
    </div>
  );
}
