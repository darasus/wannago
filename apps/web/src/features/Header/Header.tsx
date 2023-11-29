import {Button, CardBase, LoadingBlock, Logo} from 'ui';
import {UserSection} from '../UserSection/UserSection';
import {Suspense} from 'react';
import {DesktopMenu} from '../../components/DesktopMenu';
import {MobileMenu} from '../../components/MobileMenu';
import Link from 'next/link';
import {api} from '../../trpc/server-http';
import {VerifyEmailBar} from '../VerifyEmailBar/VerifyEmailBar';

export async function Header() {
  const me = await api.user.me.query();
  const showUserProfile = !!me;
  const showAuthButtons = !me;

  return (
    <header className="flex flex-col gap-4">
      <VerifyEmailBar />
      <CardBase>
        <nav className="relative flex justify-between">
          <div className="flex items-center gap-x-4 md:gap-x-8">
            <div className="flex items-center h-[40px]">
              <Logo href={!!me ? '/events' : '/'} />
            </div>
            <DesktopMenu />
          </div>
          <div className="flex items-center gap-x-4 md:gap-x-4">
            <MobileMenu />
            {showUserProfile && (
              <Suspense fallback={<LoadingBlock />}>
                <UserSection
                  mePromise={api.user.me.query()}
                  hasUnseenConversationPromise={api.conversation.getUserHasUnseenConversation.query()}
                />
              </Suspense>
            )}
            {showAuthButtons && (
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
