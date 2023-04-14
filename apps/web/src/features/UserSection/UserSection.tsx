import {useAuth} from '@clerk/nextjs';
import {Popover, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import {Avatar, Button, CardBase, LoadingBlock} from 'ui';
import {
  useSessionQuery,
  useSetSessionMutation,
  useMyOrganizationQuery,
  useMyUserQuery,
  useHasUnseenConversation,
} from 'hooks';
import {useRouter} from 'next/router';
import {trpc} from 'trpc/src/trpc';
import {PlusCircleIcon} from '@heroicons/react/24/solid';

export function UserSection() {
  const router = useRouter();
  const {signOut} = useAuth();
  const user = useMyUserQuery();
  const organization = useMyOrganizationQuery();
  const session = useSessionQuery();
  const setSession = useSetSessionMutation();
  const isOrganization = session.data === 'organization';
  const utils = trpc.useContext();
  const hasUnseenConversation = useHasUnseenConversation();

  const toggleSession = () => {
    if (isOrganization) {
      setSession.mutate({userType: 'user'});
    } else {
      setSession.mutate({userType: 'organization'});
    }
    router.push('/dashboard');
  };

  const onSignOutClick = async () => {
    await signOut();
    await utils.invalidate();
  };

  const getName = () => {
    if (isOrganization) {
      return organization.data?.name;
    }

    return user.data?.firstName;
  };

  const getImage = () => {
    if (isOrganization) {
      return organization.data?.logoSrc;
    }

    if (user.data?.profileImageSrc?.includes('gravatar')) {
      return null;
    }

    return user.data?.profileImageSrc;
  };

  const label = isOrganization
    ? `Use as ${user.data?.firstName}`
    : `Use as ${organization?.data?.name}`;

  if (user.isLoading && !user.data) {
    return <LoadingBlock />;
  }

  return (
    <div className="flex gap-2">
      <Button
        className="flex md:hidden"
        onClick={() => router.push('/e/add')}
        iconLeft={<PlusCircleIcon />}
        data-testid="add-event-button"
      />
      <Button
        className="hidden md:flex"
        onClick={() => router.push('/e/add')}
        iconLeft={<PlusCircleIcon />}
        data-testid="add-event-button"
      >
        Create event
      </Button>
      <Popover className="relative z-50">
        {() => (
          <>
            <Popover.Button as="div" data-testid="header-user-section-button">
              <Button
                className="flex md:hidden"
                variant="neutral"
                iconLeft={
                  <Avatar
                    className="h-6 w-6"
                    src={getImage()}
                    data-testid="user-header-button"
                    alt={'avatar'}
                  />
                }
                hasNotificationBadge={hasUnseenConversation.data}
              />
              <Button
                className="hidden md:flex"
                variant="neutral"
                iconLeft={
                  <Avatar
                    className="h-6 w-6"
                    src={getImage()}
                    data-testid="user-header-button"
                    alt={'avatar'}
                  />
                }
                hasNotificationBadge={hasUnseenConversation.data}
              >
                {getName()}
              </Button>
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
                      {Boolean(organization.data) && (
                        <Button
                          onClick={() => {
                            toggleSession();
                            close();
                          }}
                          size="sm"
                          variant="neutral"
                          data-testid="toggle-session-button"
                        >
                          {label}
                        </Button>
                      )}
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
                          router.push(
                            isOrganization
                              ? `/o/${organization?.data?.id}`
                              : `/u/${user.data?.id}`
                          );
                          close();
                        }}
                      >
                        Profile
                      </Button>
                      <Button
                        variant="neutral"
                        size="sm"
                        onClick={() => {
                          router.push('/settings/personal');
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
    </div>
  );
}
