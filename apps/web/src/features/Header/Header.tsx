'use client';

import {Button, CardBase, LoadingBlock, Logo} from 'ui';
import {UserSection} from '../UserSection/UserSection';
import {Suspense} from 'react';
import {DesktopMenu} from '../../components/DesktopMenu';
import {MobileMenu} from '../../components/MobileMenu';
import Link from 'next/link';
import {VerifyEmailBar} from '../VerifyEmailBar/VerifyEmailBar';
import {User} from '@prisma/client';
import {RouterOutputs} from 'api';

interface Props {
  me: User | null;
  hasUnseenConversationPromise: Promise<
    RouterOutputs['conversation']['getUserHasUnseenConversation']
  >;
}

export function Header({me, hasUnseenConversationPromise}: Props) {
  return (
    <header className="flex flex-col gap-4">
      <VerifyEmailBar me={me} />
      <CardBase>
        <nav className="relative flex justify-between">
          <div className="flex items-center gap-x-4 md:gap-x-8">
            <div className="flex items-center h-[40px]">
              <Logo href={!!me ? '/dashboard' : '/'} />
            </div>
            <DesktopMenu />
          </div>
          <div className="flex items-center gap-x-4 md:gap-x-4">
            <MobileMenu me={me} />
            {me && (
              <Suspense fallback={<LoadingBlock />}>
                <UserSection
                  me={me}
                  hasUnseenConversationPromise={hasUnseenConversationPromise}
                />
              </Suspense>
            )}
            {!me && (
              <Button
                asChild
                className="hidden md:flex"
                variant="default"
                size="sm"
                data-testid="login-button"
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
            )}
          </div>
        </nav>
      </CardBase>
    </header>
  );
}
