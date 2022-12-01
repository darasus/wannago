import {Fragment} from 'react';
import Link from 'next/link';
import {Popover, Transition} from '@headlessui/react';
import clsx from 'clsx';
import {Container} from './Container';
import {Logo} from './Logo';
import {NavLink} from '../NavLink/NavLink';
import {CardBase} from '../Card/CardBase/CardBase';
import {Button} from '../Button/Button';

function MobileNavLink({href, children}: any) {
  return (
    <Popover.Button as={Link} href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  );
}

function MobileNavIcon({open}: any) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0'
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          'origin-center transition',
          !open && 'scale-90 opacity-0'
        )}
      />
    </svg>
  );
}

function MobileNavigation() {
  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({open}) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            <MobileNavLink href="#features">Features</MobileNavLink>
            <MobileNavLink href="#testimonials">Testimonials</MobileNavLink>
            <MobileNavLink href="#pricing">Pricing</MobileNavLink>
            <hr className="m-2 border-slate-300/40" />
            <MobileNavLink href="/login">Sign in</MobileNavLink>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

export function Header() {
  return (
    <header className="py-10">
      <Container>
        <CardBase>
          <nav className="relative z-50 flex justify-between">
            <div className="flex items-center md:gap-x-4">
              <Link href="#" aria-label="Home">
                <Logo />
              </Link>
              <div className="hidden md:flex md:gap-x-2">
                <Button variant="neutral" size="xs">
                  Features
                </Button>
                <Button variant="neutral" size="xs">
                  Testimonials
                </Button>
                <Button variant="neutral" size="xs">
                  Pricing
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-x-5 md:gap-x-4">
              <Button className="hidden md:block" variant="secondary" size="xs">
                <span>Sign in</span>
              </Button>
              <Button size="xs">
                <span>
                  Get started <span className="hidden lg:inline">today</span>
                </span>
              </Button>
              <div className="-mr-1 md:hidden">
                <MobileNavigation />
              </div>
            </div>
          </nav>
        </CardBase>
      </Container>
    </header>
  );
}
