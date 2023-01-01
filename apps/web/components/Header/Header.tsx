import {Fragment} from 'react';
import {Popover, Transition} from '@headlessui/react';
import clsx from 'clsx';
import {Container} from '../Container/Container';
import {Logo} from '../Logo/Logo';
import {CardBase} from '../CardBase/CardBase';
import {Button} from '../Button/Button';
import {useRouter} from 'next/router';
import {useUser} from '@clerk/nextjs';
import {UserSection} from '../UserSection/UserSection';
import {FeedbackFish} from '@feedback-fish/react';

export const navItems = [
  {label: 'Features', href: `/#features`},
  {label: 'FAQ', href: `/#faq`},
  {label: 'Examples', href: `/examples`},
];

function MobileNavIcon({open}: any) {
  return (
    <svg
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

function isPublicRoute(pathname: string) {
  return (
    pathname === '/' ||
    pathname.startsWith('/examples') ||
    pathname.startsWith('/e/') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register')
  );
}

export function Header() {
  const router = useRouter();
  const isPublic = isPublicRoute(router.pathname);
  const {isSignedIn} = useUser();
  const showUserProfile = !isPublic && isSignedIn;
  const showFeedback = isPublic;
  const showDashboardLink = isSignedIn && isPublic;
  const showAuthButtons = isPublic && !isSignedIn;
  const showMobileMenu = !isSignedIn || isPublic;

  return (
    <header>
      <Container className="md:px-4">
        <CardBase>
          <nav className="relative flex justify-between">
            <div className="flex items-center">
              <Logo href={isPublic ? '/' : '/dashboard'} className="mr-8" />
              {isPublic && (
                <div className="hidden md:flex gap-x-5 md:gap-x-4">
                  {navItems.map((item, i) => (
                    <Button
                      as="a"
                      href={item.href}
                      key={i}
                      variant="neutral"
                      size="sm"
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-x-5 md:gap-x-4">
              {showFeedback && (
                <div className="hidden md:block">
                  <FeedbackFish projectId="f843146d960b2f">
                    <Button variant="neutral" size="sm">
                      Feedback
                    </Button>
                  </FeedbackFish>
                </div>
              )}
              {showUserProfile && <UserSection />}
              {showDashboardLink && (
                <>
                  <Button
                    as="a"
                    href="/dashboard"
                    className="hidden md:block"
                    variant="secondary"
                    size="sm"
                    data-testid="dashboard-button"
                  >
                    <span>Dashboard</span>
                  </Button>
                </>
              )}
              {showAuthButtons && (
                <>
                  <Button
                    as="a"
                    href="/login"
                    className="hidden md:block"
                    variant="secondary"
                    size="sm"
                    data-testid="login-button"
                  >
                    <span>Sign in</span>
                  </Button>
                  <Button
                    as="a"
                    href={'/register'}
                    size="sm"
                    data-testid="register-button"
                  >
                    <span>
                      Get started{' '}
                      <span className="hidden lg:inline">today</span>
                    </span>
                  </Button>
                </>
              )}
              {showMobileMenu && (
                <div className="-mr-1 md:hidden">
                  <Popover>
                    <Popover.Button
                      className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
                      data-testid="mobile-nav-button"
                    >
                      {({open}) => <MobileNavIcon open={open} />}
                    </Popover.Button>
                    <Transition.Root className="z-10">
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
                          className="absolute z-50 inset-x-0 top-20 flex origin-top flex-col tracking-tight -mx-4"
                        >
                          <CardBase>
                            <div className="flex flex-col items-start gap-y-4">
                              {navItems.map((item, i) => (
                                <Fragment key={i}>
                                  <Popover.Button
                                    as={(props: any) => (
                                      <Button
                                        {...props}
                                        as="a"
                                        variant="neutral"
                                      />
                                    )}
                                    href={item.href}
                                  >
                                    {item.label}
                                  </Popover.Button>
                                </Fragment>
                              ))}
                              <div>
                                <FeedbackFish projectId="f843146d960b2f">
                                  <Button variant="neutral">Feedback</Button>
                                </FeedbackFish>
                              </div>
                            </div>
                            <hr className="my-4 border-slate-300/40" />
                            <div className="flex gap-4">
                              {showAuthButtons && (
                                <>
                                  <Popover.Button
                                    as={(props: any) => (
                                      <Button
                                        {...props}
                                        as="a"
                                        variant="secondary"
                                        data-testid="mobile-login-button"
                                        href={'/login'}
                                      />
                                    )}
                                  >
                                    Login
                                  </Popover.Button>
                                  <Popover.Button
                                    as={(props: any) => (
                                      <Button
                                        {...props}
                                        as="a"
                                        variant="primary"
                                        data-testid="mobile-register-button"
                                        href={'/register'}
                                      />
                                    )}
                                  >
                                    Register
                                  </Popover.Button>
                                </>
                              )}
                              {showDashboardLink && (
                                <Popover.Button
                                  as={(props: any) => (
                                    <Button
                                      {...props}
                                      as="a"
                                      variant="primary"
                                      data-testid="mobile-dashboard-button"
                                      href={'/dashboard'}
                                    />
                                  )}
                                >
                                  Dashboard
                                </Popover.Button>
                              )}
                            </div>
                          </CardBase>
                        </Popover.Panel>
                      </Transition.Child>
                    </Transition.Root>
                  </Popover>
                </div>
              )}
            </div>
          </nav>
        </CardBase>
      </Container>
    </header>
  );
}
