import {useClerk} from '@clerk/nextjs';
import {Popover, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import {Avatar, Badge, Button, CardBase} from 'ui';
import {FeedbackFish} from '@feedback-fish/react';
import {useMe} from 'hooks';

export function UserSection() {
  const {signOut} = useClerk();
  const {me} = useMe();
  const showAdminLink = me?.type === 'ADMIN';

  const onSignOutClick = async () => {
    await signOut();
  };

  if (!me) return null;

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
                    src={
                      me?.profileImageSrc?.includes('gravatar')
                        ? undefined
                        : me?.profileImageSrc
                    }
                    data-testid="user-header-button"
                    alt={'avatar'}
                  />
                }
              >
                {me?.firstName}
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
                    href={`/u/${me?.id}`}
                    size="sm"
                    data-testid="profile-button"
                  >
                    Profile
                  </Button>
                  <Button
                    variant="neutral"
                    as="a"
                    href={`/team`}
                    size="sm"
                    data-testid="team-button"
                  >
                    Team{' '}
                    <Badge color="green" size="xxs">
                      PRO
                    </Badge>
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
                  <FeedbackFish
                    projectId="f843146d960b2f"
                    userId={me?.externalId || undefined}
                  >
                    <Button variant="neutral" size="sm">
                      Feedback
                    </Button>
                  </FeedbackFish>
                </CardBase>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
