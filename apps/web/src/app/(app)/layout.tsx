'use client';

import * as React from 'react';

import {Container, Logo, Separator} from 'ui';
import {Nav} from './Nav';
import {
  Building,
  List,
  LogOut,
  Mail,
  PenBox,
  Settings,
  Ticket,
  User2,
} from 'lucide-react';
import {useMe} from 'hooks';

export default function AppLayout({children}: {children: React.ReactNode}) {
  const me = useMe();

  return (
    <Container maxSize="sm">
      <div className="flex border rounded-md">
        <div className="border-r w-16">
          <div className="w-16 h-16 flex items-center justify-center">
            <Logo className="h-[15px]" href="/events/all" />
          </div>
          <Separator />
          <Nav
            links={[
              {
                title: me?.firstName ?? 'Profile',
                imageSrc: me?.profileImageSrc ?? undefined,
                icon: me?.profileImageSrc ? undefined : User2,
                variant: 'ghost',
                href: `/u/${me?.id}`,
              },
            ]}
          />
          <Separator />
          <Nav
            links={[
              {
                title: 'Create',
                label: '',
                icon: PenBox,
                variant: 'ghost',
                href: '/e/add',
              },
              {
                title: 'Events',
                icon: List,
                variant: 'ghost',
                href: '/events/all',
              },
              {
                title: 'Tickets',
                icon: Ticket,
                variant: 'ghost',
                href: '/my-tickets',
              },
              {
                title: 'Organizations',
                icon: Building,
                variant: 'ghost',
                href: '/organizations',
              },
              {
                title: 'Settings',
                icon: Settings,
                variant: 'ghost',
                href: '/settings',
              },
              {
                title: 'Messages',
                icon: Mail,
                variant: 'ghost',
                href: '/messages',
              },
              {
                title: 'Logout',
                icon: LogOut,
                variant: 'ghost',
                href: '/logout',
              },
            ]}
          />
        </div>
        <div className="grow">{children}</div>
      </div>
    </Container>
  );
}
