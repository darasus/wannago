import {RedirectToSignIn, SignedIn, SignedOut} from '@clerk/nextjs';
import {NextComponentType} from 'next';

export function withProtected(Component: NextComponentType<any, any, any>) {
  return function Render(props: any) {
    return (
      <>
        <SignedIn>
          <Component {...props} />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn redirectUrl={'/login'} />
        </SignedOut>
      </>
    );
  };
}
