import {CardBase, Logo} from 'ui';
import {UserSection} from '../UserSection/UserSection';
import {DesktopMenu} from '../../components/DesktopMenu';
import {MobileMenu} from '../../components/MobileMenu';
import {VerifyEmailBar} from '../VerifyEmailBar/VerifyEmailBar';
import {Suspense} from 'react';
import {HeaderLogo} from './HeaderLogo';
import {MyEventsButton} from './MyEventsButton';

export async function Header() {
  return (
    <header className="flex flex-col gap-4">
      <VerifyEmailBar />
      <CardBase>
        <nav className="relative flex justify-between">
          <div className="flex items-center gap-x-4 md:gap-x-8">
            <div className="flex items-center h-[40px]">
              <Suspense fallback={<Logo href="/" />}>
                <HeaderLogo />
              </Suspense>
            </div>
            <DesktopMenu />
          </div>
          <div className="flex items-center gap-x-4 md:gap-x-4">
            <Suspense>
              <MobileMenu />
            </Suspense>
            <Suspense>
              <UserSection />
            </Suspense>
            <Suspense>
              <MyEventsButton />
            </Suspense>
          </div>
        </nav>
      </CardBase>
    </header>
  );
}
