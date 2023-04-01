import {useAuth} from '@clerk/nextjs';
import {Popover, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import {Avatar, Button, CardBase, LoadingBlock} from 'ui';
import {
  useSessionQuery,
  useSetSessionMutation,
  useMyOrganizationQuery,
  useMyUserQuery,
} from 'hooks';
import {useRouter} from 'next/router';
import {trpc} from 'trpc/src/trpc';

export function UserSection() {
  const router = useRouter();
  const {signOut} = useAuth();
  const user = useMyUserQuery();
  const organization = useMyOrganizationQuery();
  const session = useSessionQuery();
  const setSession = useSetSessionMutation();
  const isOrganization = session.data === 'organization';
  const utils = trpc.useContext();

  const toggleSession = () => {
    if (isOrganization) {
      setSession.mutate({userType: 'user'});
    } else {
      setSession.mutate({userType: 'organization'});
    }
    router.push('/dashboard');
  };

  const showAdminLink = false;

  const onSignOutClick = async () => {
    await signOut();
    await utils.invalidate();
    router.push('/');
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
                      isOrganization
                        ? `/o/${organization?.data?.id}`
                        : `/u/${user.data?.id}`
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
