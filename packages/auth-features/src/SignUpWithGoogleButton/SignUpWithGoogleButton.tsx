import {useSignUp} from '@clerk/nextjs';
import {useTransition} from 'react';
import {Button, Icons} from 'ui';

export function SignUpWithGoogleButton() {
  const {signUp} = useSignUp();
  const [isPending, startTransition] = useTransition();

  const onClick = async () => {
    startTransition(async () => {
      await signUp?.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/auth/callback',
        redirectUrlComplete: '/dashboard',
      });
    });
  };

  return (
    <Button
      className="w-full"
      type="button"
      disabled={isPending}
      onClick={onClick}
    >
      {isPending ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.google className="mr-2 h-4 w-4" />
      )}{' '}
      Google
    </Button>
  );
}
