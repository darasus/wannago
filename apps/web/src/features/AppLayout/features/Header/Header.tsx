import {Button, CardBase, Logo} from 'ui';
import {UserSection} from '../UserSection/UserSection';
import {useAuth} from '@clerk/nextjs';
import {useRouter} from 'next/router';
import {getIsPublic} from './constants';
import {MobileMenu} from './MobileMenu';
import {DesktopMenu} from './DesktopMenu';

export function Header() {
  const router = useRouter();
  const auth = useAuth();
  const isPublic = getIsPublic(router.asPath);
  const showUserProfile = auth.isLoaded && auth.isSignedIn;
  const showAuthButtons = auth.isLoaded && !auth.isSignedIn;
  const showMobileMenu = isPublic;
  const showDesktopHomeNav = isPublic;

  return (
    <header>
      <CardBase>
        <nav className="relative flex justify-between">
          <div className="flex items-center gap-x-4 md:gap-x-8">
            <Logo href={auth.isSignedIn ? '/dashboard' : '/'} />
            {showDesktopHomeNav && <DesktopMenu />}
            {showMobileMenu && <MobileMenu />}
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-4">
            {showUserProfile && <UserSection />}
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
