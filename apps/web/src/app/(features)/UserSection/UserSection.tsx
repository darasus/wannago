'use client';

import {useAuth} from '@clerk/nextjs';
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
import {getIsPublic} from '../../../features/AppLayout/features/Header/constants';
import {useRouter} from 'next/navigation';
import {User} from '@prisma/client';
import {PlusCircle} from 'lucide-react';

interface Props {
  mePromise: Promise<User | null>;
  hasUnseenConversationPromise: Promise<boolean>;
}

export function UserSection({mePromise, hasUnseenConversationPromise}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const {signOut} = useAuth();
  const me = use(mePromise);
  // TODO
  const hasUnseenConversation = use(hasUnseenConversationPromise);
  const isPublicPage = getIsPublic(pathname ?? '/');

  const onSignOutClick = async () => {
    await signOut();
    window.location.href = '/';
  };

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
        close();
      },
    },
    {
      label: 'Profile',
      onClick: () => {
        router.push(`/u/${me?.id}`);
        close();
      },
      'data-testid': 'profile-button',
    },
    {
      label: 'Organizations',
      onClick: () => {
        router.push(`/organizations`);
        close();
      },
      'data-testid': 'organizations-button',
    },
    {
      label: 'Settings',
      onClick: () => {
        router.push(`/settings`);
        close();
      },
    },
    {
      label: 'Messages',
      onClick: () => {
        router.push(`/messages`);
        close();
      },
    },
    {
      label: 'Logout',
      onClick: () => {
        onSignOutClick();
        close();
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
      >
        <PlusCircle />
      </Button>
      <Button
        className="hidden md:flex"
        onClick={() => router.push('/e/add')}
        data-testid="add-event-button"
      >
        <PlusCircle className="mr-2 w-4 h-4" />
        Create event
      </Button>
      {me && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" data-testid="header-user-button">
              <Avatar
                className="h-6 w-6"
                src={me.profileImageSrc}
                alt={'avatar'}
              />
              {me.firstName}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {options.map(({label, onClick, ...rest}) => {
                return (
                  <DropdownMenuItem key={label} {...rest}>
                    <span>{label}</span>
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
