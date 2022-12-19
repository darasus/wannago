import {useClerk, useUser} from '@clerk/nextjs';
import {Popover, Transition} from '@headlessui/react';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {Fragment} from 'react';
import {Button} from '../Button/Button';
import {CardBase} from '../Card/CardBase/CardBase';

export function UserSecsion() {
  const router = useRouter();
  const {user, isLoaded} = useUser();
  const {signOut} = useClerk();

  const onSignOutClick = async () => {
    await signOut();
    router.push('/');
  };

  if (!isLoaded) return null;

  return (
    <div className="">
      <Popover className="relative">
        {({open}) => (
          <>
            <Popover.Button as="div">
              <Button
                variant="neutral"
                iconLeft={
                  <div className="rounded-full overflow-hidden">
                    <Image
                      src={user?.profileImageUrl!}
                      height={20}
                      width={20}
                      alt={`Profile pic for ${user?.fullName}`}
                    />
                  </div>
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
                <CardBase className="flex flex-col gap-y-4">
                  <Button variant="neutral" as="a" href="/me">
                    Settings
                  </Button>
                  <Button variant="secondary" onClick={onSignOutClick}>
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
