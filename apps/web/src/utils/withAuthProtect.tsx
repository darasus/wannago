import {RedirectToSignIn, SignedIn, SignedOut} from '@clerk/nextjs';

export function withProtected(Component: any) {
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
