import {useAuth} from '@clerk/nextjs';
import {Popover, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import {Button, CardBase, LoadingBlock} from 'ui';
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
import {UserSwitcher} from './features/UserSwitcher';
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline';
import {getIsPublic} from '../Header/constants';

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
  const isPublicPage = getIsPublic(router.asPath);

  const onSignOutClick = async () => {
    await setSession.mutateAsync({userType: 'user'});
    await utils.invalidate();
    await signOut();
  };

  if (user.isLoading && !user.data) {
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
      <UserSwitcher />
      <Popover className="relative z-50">
        {() => (
          <>
            <Popover.Button as="div" data-testid="header-user-section-button">
              {({open}) => {
                return (
                  <Button
                    iconLeft={open ? <XMarkIcon /> : <Bars3Icon />}
                    variant="neutral"
                    hasNotificationBadge={hasUnseenConversation.data}
                  />
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
