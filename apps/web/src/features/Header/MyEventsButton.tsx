import Link from 'next/link';
import {Button} from 'ui';
import {api} from '../../trpc/server-http';

export async function MyEventsButton() {
  const me = await api.user.me.query().catch(() => null);

  if (me) {
    return null;
  }

  return (
    <Button
      asChild
      className="hidden md:flex"
      variant="default"
      size="sm"
      data-testid="login-button"
    >
      <Link href="/sign-in">Sign in</Link>
    </Button>
  );
}
