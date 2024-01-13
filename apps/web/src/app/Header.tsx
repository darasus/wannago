import {CardBase, Logo} from 'ui';
import {UserSection} from 'features/src/UserSection/UserSection';
import {api} from '../trpc/server-http';
import {VerifyEmailBar} from 'features/src/VerifyEmailBar/VerifyEmailBar';

export async function Header() {
  const me = await api.user.me.query();

  if (!me) {
    return null;
  }

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
            <UserSection me={me} />
          </div>
        </nav>
      </CardBase>
    </header>
  );
}
