'use client';

import {RouterOutputs} from 'api';
import {ChevronDown, Plus} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui';
import {cn} from 'utils';

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
      label: 'Settings',
      onClick: () => {
        router.push(`/admin/settings`);
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
        onClick={() => router.push('/admin/event/add')}
        data-testid="add-event-button-mini"
        size="icon"
      >
        <Plus />
      </Button>
      <Button
        className="hidden md:flex"
        onClick={() => router.push('/admin/event/add')}
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
