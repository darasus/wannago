import {useSignIn} from '@clerk/nextjs';
import {Button} from 'ui';

export function SignInWithGoogleButton(props?: {redirectUrlComplete?: string}) {
  const {signIn} = useSignIn();

  const onClick = async () => {
    await signIn?.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/auth/callback',
      redirectUrlComplete: props?.redirectUrlComplete ?? '/dashboard',
    });
  };

  return <Button onClick={onClick}>Continue with Google</Button>;
}
