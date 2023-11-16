'use client';

import {use} from 'react';
import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui';
import {usePathname} from 'next/navigation';
import {getIsPublic} from 'const';
import {useRouter} from 'next/navigation';
import {User} from '@prisma/client';
import {ChevronDown, Plus} from 'lucide-react';
import {cn} from 'utils';
import {RouterOutputs} from 'api';

interface Props {
  me: User | null;
  hasUnseenConversationPromise: Promise<
    RouterOutputs['conversation']['getUserHasUnseenConversation']
  >;
}

export function UserSection({hasUnseenConversationPromise, me}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const hasUnseenConversation = use(hasUnseenConversationPromise);
  const isPublicPage = getIsPublic(pathname ?? '/');

  if (isPublicPage) {
    return (
      <div className="flex gap-2">
        <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
      </div>
    );
  }

  const options = [
    {
      label: 'Dashboard',
      onClick: () => {
        router.push('/dashboard');
      },
    },
    {
      label: 'Profile',
      onClick: () => {
        router.push(`/u/${me?.id}`);
      },
      'data-testid': 'profile-button',
    },
    {
      label: 'My tickets',
      onClick: () => {
        router.push(`/my-tickets`);
      },
      'data-testid': 'my-tickets-button',
    },
    {
      label: 'Organizations',
      onClick: () => {
        router.push(`/organizations`);
      },
      'data-testid': 'organizations-button',
    },
    {
      label: 'Settings',
      onClick: () => {
        router.push('/logout');
      },
    },
    {
      label: (
        <span className="relative">
          Messages{' '}
          {hasUnseenConversation && (
            <span className="text-red-400">{`(new)`}</span>
          )}
        </span>
      ),
      onClick: () => {
        router.push(`/messages`);
      },
    },
    {
      label: 'Logout',
      onClick: () => {
        router.push('/logout');
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
              {hasUnseenConversation && (
                <div className="h-4 w-4 bg-red-400 rounded-full absolute -top-1 -right-1" />
              )}
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
