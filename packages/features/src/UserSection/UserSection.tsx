'use client';

import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui';
import {useRouter} from 'next/navigation';
import {ChevronDown, Plus} from 'lucide-react';
import {cn} from 'utils';
import {RouterOutputs} from 'api';

interface Props {
  me: RouterOutputs['user']['me'];
}

export function UserSection({me}: Props) {
  const router = useRouter();

  const onSignOutClick = async () => {
    router.push('/logout');
  };

  const options = [
    {
      label: 'Events',
      onClick: () => {
        router.push('/events');
      },
    },
    {
      label: 'Tickets',
      onClick: () => {
        router.push(`/my-tickets`);
      },
      'data-testid': 'my-tickets-button',
    },
    {
      label: 'Settings',
      onClick: () => {
        router.push(`/settings`);
      },
    },
    {
      label: 'Logout',
      onClick: () => {
        onSignOutClick();
      },
      'data-testid': 'logout-button',
    },
  ];

  return (
    <div className="flex gap-2">
      <Button
        className="flex md:hidden"
        onClick={() => router.push('/e/add')}
        data-testid="add-event-button-mini"
        size="icon"
      >
        <Plus />
      </Button>
      <Button
        className="hidden md:flex"
        onClick={() => router.push('/e/add')}
        data-testid="add-event-button"
      >
        <Plus className="mr-2 w-4 h-4" />
        Create event
      </Button>
      {me && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              data-testid="header-user-button"
              className="relative"
            >
              <Avatar
                className="h-6 w-6 mr-2"
                src={me.profileImageSrc}
                alt={'avatar'}
              />
              {me.firstName}
              <ChevronDown className="ml-1 w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {options.map(({label, ...rest}, i) => {
                const isRed = label === 'Logout';
                return (
                  <DropdownMenuItem key={i} {...rest}>
                    <span className={cn({'text-red-500': isRed})}>{label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
