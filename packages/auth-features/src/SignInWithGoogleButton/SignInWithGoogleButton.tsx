import {useSignIn} from '@clerk/nextjs';
import {Button} from 'ui';

export function SignInWithGoogleButton() {
  const {signIn} = useSignIn();

  const onClick = async () => {
    await signIn?.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/auth/callback',
      redirectUrlComplete: '/dashboard',
    });
  };

  return <Button onClick={onClick}>Continue with Google</Button>;
}
