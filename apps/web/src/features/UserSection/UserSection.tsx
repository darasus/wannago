import {useAuth} from '@clerk/nextjs';
import {Popover, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import {Avatar, Button, CardBase} from 'ui';
import {
  useSessionQuery,
  useSetSessionMutation,
  useMyOrganizationQuery,
  useMyUser,
} from 'hooks';

export function UserSection() {
  const {signOut} = useAuth();
  const user = useMyUser();
  const organization = useMyOrganizationQuery();
  const session = useSessionQuery();
  const setSession = useSetSessionMutation();

  const toggleSession = () => {
    if (session.data === 'organization') {
      setSession.mutate({userType: 'user'});
    } else {
      setSession.mutate({userType: 'organization'});
    }
  };

  const showAdminLink = false;

  const onSignOutClick = async () => {
    await signOut();
  };

  const getName = () => {
    if (session.data === 'organization') {
      return organization.data?.name;
    }

    return user.data?.firstName;
  };

  const getImage = () => {
    if (session.data === 'organization') {
      return organization.data?.logoSrc;
    }

    if (user.data?.profileImageSrc?.includes('gravatar')) {
      return null;
    }

    return user.data?.profileImageSrc;
  };

  const label =
    session.data === 'organization'
      ? `Use as ${organization?.data?.name}`
      : `Use as ${user.data?.firstName}`;

  return (
    <div>
      <Popover className="relative z-50">
        {() => (
          <>
            <Popover.Button as="div" data-testid="header-user-section-button">
              <Button
                variant="neutral"
                iconLeft={
                  <Avatar
                    className="h-6 w-6"
                    src={getImage()}
                    data-testid="user-header-button"
                    alt={'avatar'}
                  />
                }
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
                <CardBase innerClassName="flex flex-col gap-y-2 w-40">
                  {Boolean(organization.data) && (
                    <Button
                      onClick={toggleSession}
                      isLoading={setSession.isLoading}
                      size="sm"
                      variant="neutral"
                    >
                      {label}
                    </Button>
                  )}
                  <Button
                    variant="neutral"
                    as="a"
                    href={`/dashboard`}
                    size="sm"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="neutral"
                    as="a"
                    href={
                      session.data === 'user'
                        ? `/u/${user.data?.id}`
                        : `/o/${organization?.data?.id}`
                    }
                    size="sm"
                    data-testid="profile-button"
                  >
                    Profile
                  </Button>
                  <Button variant="neutral" as="a" href="/settings" size="sm">
                    Settings
                  </Button>
                  {showAdminLink && (
                    <Button variant="neutral" as="a" href="/admin" size="sm">
                      Admin
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    onClick={onSignOutClick}
                    data-testid="logout-button"
                    size="sm"
                  >
                    Logout
                  </Button>
                </CardBase>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
