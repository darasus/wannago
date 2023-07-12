import {AuthenticateWithRedirectCallback} from '@clerk/nextjs';

export default function AuthCallback() {
  return (
    <AuthenticateWithRedirectCallback
      afterSignInUrl={'/dashboard/all'}
      afterSignUpUrl={'/dashboard/all'}
      continueSignUpUrl={'/dashboard/all'}
    />
  );
}
