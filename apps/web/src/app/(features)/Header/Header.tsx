import {Button, CardBase, LoadingBlock, Logo} from 'ui';
import {UserSection} from '../UserSection/UserSection';
import {auth} from '@clerk/nextjs';
import {api} from '../../../trpc/server';
import {Suspense} from 'react';
import {DesktopMenu} from '../../(components)/DesktopMenu';
import {MobileMenu} from '../../(components)/MobileMenu';

export async function Header() {
  const authData = auth();
  const showUserProfile = authData.userId;
  const showAuthButtons = !authData.userId;

  return (
    <header>
      <CardBase>
        <nav className="relative flex justify-between">
          <div className="flex items-center gap-x-4 md:gap-x-8">
            <Logo href={authData.userId ? '/dashboard' : '/'} />
            <DesktopMenu />
            <MobileMenu />
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-4">
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
                as="a"
                href="/login"
                className="hidden md:flex"
                variant="secondary"
                size="sm"
                data-testid="login-button"
              >
                <span>Sign in</span>
              </Button>
            )}
          </div>
        </nav>
      </CardBase>
    </header>
  );
}
