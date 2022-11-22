import {UserButton} from '@clerk/nextjs';
import {clerkAppearance} from '../../clerkElements';

export function UserSecsion() {
  return (
    <UserButton
      signInUrl="/login"
      afterSignOutUrl="/"
      userProfileUrl="/me"
      userProfileMode="navigation"
      showName={true}
      appearance={clerkAppearance}
    />
  );
}
