import {Logo} from 'ui';
import {api} from '../../trpc/server-http';

export async function HeaderLogo() {
  const me = await api.user.me.query();

  return <Logo href={!!me ? '/events' : '/'} />;
}
