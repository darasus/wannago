import {useClerk, useUser} from '@clerk/nextjs';
import {Popover, Transition} from '@headlessui/react';
import Image from 'next/image';
import {Fragment} from 'react';
import {Avatar, Button, CardBase} from 'ui';
import {FeedbackFish} from '@feedback-fish/react';
import {trpc} from 'trpc/src/trpc';

export function UserSection() {
  const {user, isLoaded} = useUser();
  const {signOut} = useClerk();
  const {data} = trpc.me.me.useQuery();
  const showAdminLink = data?.type === 'ADMIN';

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
                  user?.profileImageUrl && (
                    <Avatar
                      className="h-6 w-6"
                      src={user?.profileImageUrl}
                      data-testid="user-header-button"
                      alt={'avatar'}
                    />
                  )
                  // <div className="rounded-full overflow-hidden">
                  //   <Image
                  //     src={user?.profileImageUrl!}
                  //     height={24}
                  //     width={24}
                  //     alt={`Profile pic for ${user?.fullName}`}
                  //     data-testid="user-header-button"
                  //   />
                  // </div>
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
                <CardBase innerClassName="flex flex-col gap-y-4">
                  <Button variant="neutral" as="a" href={`/u/${data?.id}`}>
                    Profile
                  </Button>
                  <Button variant="neutral" as="a" href="/me">
                    Settings
                  </Button>
                  {showAdminLink && (
                    <Button variant="neutral" as="a" href="/admin">
                      Admin
                    </Button>
                  )}
                  <FeedbackFish projectId="f843146d960b2f" userId={user?.id}>
                    <Button variant="neutral">Feedback</Button>
                  </FeedbackFish>
                  <Button
                    variant="secondary"
                    onClick={onSignOutClick}
                    data-testid="logout-button"
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
