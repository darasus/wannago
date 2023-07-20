import {useSignUp} from '@clerk/nextjs';
import {useTransition} from 'react';
import {Button, Icons} from 'ui';

export function SignUpWithGoogleButton(props?: {redirectUrlComplete?: string}) {
  const {signUp} = useSignUp();
  const [isPending, startTransition] = useTransition();

  const onClick = async () => {
    startTransition(async () => {
      await signUp?.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/auth/callback',
        redirectUrlComplete: props?.redirectUrlComplete ?? '/dashboard/all',
      });
    });
  };

  return (
    <Button
      className="w-full"
      type="button"
      disabled={isPending}
      onClick={onClick}
      variant={'outline'}
    >
      {isPending ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.google className="mr-2 h-4 w-4" />
      )}{' '}
      Continue with Google
    </Button>
  );
}
