import {useAuth} from '@clerk/nextjs';
import {Popover, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import {Avatar, Button, CardBase, LoadingBlock} from 'ui';
import {useMyUserQuery, useHasUnseenConversation, useBreakpoint} from 'hooks';
import {useRouter} from 'next/router';
import {trpc} from 'trpc/src/trpc';
import {PlusCircleIcon} from '@heroicons/react/24/solid';
import {getIsPublic} from '../Header/constants';

export function UserSection() {
  const router = useRouter();
  const {signOut} = useAuth();
  const utils = trpc.useContext();
  const hasUnseenConversation = useHasUnseenConversation();
  const isPublicPage = getIsPublic(router.asPath);
  const size = useBreakpoint();
  const canShowLabel = size !== 'sm';
  const me = useMyUserQuery();

  const onSignOutClick = async () => {
    await utils.invalidate();
    await signOut();
  };

  if (me.isLoading && !me.data) {
    return <LoadingBlock />;
  }

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
      {me.data && (
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
                          src={me.data?.profileImageSrc}
                          alt={'avatar'}
                        />
                      }
                      data-testid="header-user-button"
                    >
                      {canShowLabel ? me.data?.firstName : null}
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
                            router.push(`/u/${me.data?.id}`);
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
                          hasNotificationBadge={hasUnseenConversation.data}
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
