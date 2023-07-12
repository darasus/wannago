'use client';

import {Fragment} from 'react';
import {Popover, Transition} from '@headlessui/react';
import {Button, CardBase} from 'ui';
import {useAuth} from '@clerk/nextjs';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import {Menu, X} from 'lucide-react';
import {
  getIsPublic,
  navItems,
} from '../features/AppLayout/features/Header/constants';

export function MobileMenu() {
  const pathname = usePathname();
  const isPublic = getIsPublic(pathname ?? '/');
  const auth = useAuth();

  if (!isPublic) {
    return null;
  }

  const showAuthButtons = auth.isLoaded && !auth.isSignedIn;

  return (
    <div className="-mr-1 md:hidden">
      <Popover>
        <Popover.Button data-testid="mobile-nav-button" as={Fragment}>
          {({open}) => <Button size="icon">{open ? <X /> : <Menu />}</Button>}
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
              {({close}) => {
                return (
                  <>
                    <div className="flex flex-col items-start gap-y-2">
                      {navItems.map((item, i) => (
                        <Button
                          key={i}
                          asChild
                          variant="outline"
                          onClick={() => {
                            close();
                          }}
                        >
                          <Link href={item.href}>{item.label}</Link>
                        </Button>
                      ))}
                    </div>
                    {showAuthButtons && (
                      <>
                        <hr className="my-2 border-[1px] border-gray-800" />
                        <div className="flex gap-x-2">
                          <Button
                            asChild
                            variant="secondary"
                            data-testid="mobile-login-button"
                            onClick={() => {
                              close();
                            }}
                          >
                            <Link href={'/login'}>Login</Link>
                          </Button>
                          <Button
                            asChild
                            variant="default"
                            data-testid="mobile-register-button"
                            onClick={() => {
                              close();
                            }}
                          >
                            <Link href={'/register'}>Register</Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                );
              }}
            </Popover.Panel>
          </Transition.Child>
        </Transition.Root>
      </Popover>
    </div>
  );
}
