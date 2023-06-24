'use client';

import {useAuth} from '@clerk/nextjs';
import {Popover, Transition} from '@headlessui/react';
import {Fragment, use} from 'react';
import {Avatar, Button, CardBase} from 'ui';
import {useBreakpoint} from 'hooks';
import {usePathname} from 'next/navigation';
import {PlusCircleIcon} from '@heroicons/react/24/solid';
import {getIsPublic} from '../../../features/AppLayout/features/Header/constants';
import {useRouter} from 'next/navigation';
import {User} from '@prisma/client';

interface Props {
  mePromise: Promise<User | null>;
  hasUnseenConversationPromise: Promise<boolean>;
}

export function UserSection({mePromise, hasUnseenConversationPromise}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const {signOut} = useAuth();
  const me = use(mePromise);
  const hasUnseenConversation = use(hasUnseenConversationPromise);
  const isPublicPage = getIsPublic(pathname ?? '/');
  const size = useBreakpoint();
  const canShowLabel = size !== 'sm';

  const onSignOutClick = async () => {
    await signOut();
  };

  if (isPublicPage) {
    return (
      <div className="flex gap-2">
        <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        className="flex md:hidden"
        onClick={() => router.push('/e/add')}
        iconLeft={<PlusCircleIcon />}
        data-testid="add-event-button-mini"
      />
      <Button
        className="hidden md:flex"
        onClick={() => router.push('/e/add')}
        iconLeft={<PlusCircleIcon />}
        data-testid="add-event-button"
      >
        Create event
      </Button>
      {me && (
        <Popover className="relative z-50">
          {() => (
            <>
              <Popover.Button as="div" data-testid="header-user-section-button">
                {() => {
                  return (
                    <Button
                      variant="neutral"
                      iconLeft={
                        <Avatar
                          className="h-6 w-6"
                          src={me.profileImageSrc}
                          alt={'avatar'}
                        />
                      }
                      data-testid="header-user-button"
                    >
                      {canShowLabel ? me.firstName : null}
                    </Button>
                  );
                }}
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 mt-3 max-w-sm">
                  {({close}) => {
                    return (
                      <CardBase innerClassName="flex flex-col gap-y-2 w-40">
                        <Button
                          variant="neutral"
                          size="sm"
                          onClick={() => {
                            router.push('/dashboard');
                            close();
                          }}
                        >
                          Dashboard
                        </Button>
                        <Button
                          variant="neutral"
                          size="sm"
                          data-testid="profile-button"
                          onClick={() => {
                            router.push(`/u/${me.id}`);
                            close();
                          }}
                        >
                          Profile
                        </Button>
                        <Button
                          variant="neutral"
                          size="sm"
                          data-testid="organizations-button"
                          onClick={() => {
                            router.push('/organizations');
                            close();
                          }}
                        >
                          Organizations
                        </Button>
                        <Button
                          variant="neutral"
                          size="sm"
                          onClick={() => {
                            router.push('/settings');
                            close();
                          }}
                        >
                          Settings
                        </Button>
                        <Button
                          variant="neutral"
                          size="sm"
                          onClick={() => {
                            router.push('/messages');
                            close();
                          }}
                          hasNotificationBadge={hasUnseenConversation}
                        >
                          Messages
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            onSignOutClick();
                            close();
                          }}
                          data-testid="logout-button"
                          size="sm"
                        >
                          Logout
                        </Button>
                      </CardBase>
                    );
                  }}
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      )}
    </div>
  );
}
