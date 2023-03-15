import {useClerk, useUser} from '@clerk/nextjs';
import {Popover, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import {Avatar, Button, CardBase} from 'ui';
import {FeedbackFish} from '@feedback-fish/react';
import {useMe} from 'hooks';

export function UserSection() {
  const {user, isLoaded} = useUser();
  const {signOut} = useClerk();
  const me = useMe();
  const showAdminLink = me.data?.type === 'ADMIN';

  const onSignOutClick = async () => {
    await signOut();
  };

  if (!isLoaded) return null;

  return (
    <div>
      <Popover className="relative">
        {() => (
          <>
            <Popover.Button as="div">
              <Button
                variant="neutral"
                iconLeft={
                  <Avatar
                    className="h-6 w-6"
                    src={
                      user?.profileImageUrl.includes('gravatar')
                        ? undefined
                        : user?.profileImageUrl
                    }
                    data-testid="user-header-button"
                    alt={'avatar'}
                  />
                }
              >
                {user?.firstName}
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
              <Popover.Panel className="absolute right-0 z-10 mt-3 max-w-sm">
                <CardBase innerClassName="flex flex-col gap-y-2">
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
                    href={`/u/${me.data?.id}`}
                    size="sm"
                  >
                    Profile
                  </Button>
                  <Button variant="neutral" as="a" href="/me" size="sm">
                    Settings
                  </Button>
                  {showAdminLink && (
                    <Button variant="neutral" as="a" href="/admin" size="sm">
                      Admin
                    </Button>
                  )}
                  <FeedbackFish projectId="f843146d960b2f" userId={user?.id}>
                    <Button variant="neutral" size="sm">
                      Feedback
                    </Button>
                  </FeedbackFish>
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
