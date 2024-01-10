import {Button, CardBase, Logo} from 'ui';
import {UserSection} from 'features/src/UserSection/UserSection';
import Link from 'next/link';
import {api} from '../trpc/server-http';
import {VerifyEmailBar} from 'features/src/VerifyEmailBar/VerifyEmailBar';

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
              <Logo href={'/'} />
            </div>
          </div>
          <div className="flex items-center gap-x-4 md:gap-x-4">
            {showUserProfile && <UserSection me={me} />}
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
