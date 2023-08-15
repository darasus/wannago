import Link from 'next/link';
import {Button, Icons} from 'ui';

export function ContinueWithGoogleButton(props?: {
  redirectUrlComplete?: string;
}) {
  return (
    <Button asChild className="w-full" type="button" variant={'outline'}>
      <Link href="/sign-in/google">
        <Icons.google className="mr-2 h-4 w-4" />
        Continue with Google
      </Link>
    </Button>
  );
}
