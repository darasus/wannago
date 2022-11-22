import {UserButton} from '@clerk/nextjs';

export function UserSecsion() {
  return (
    <UserButton
      signInUrl="/login"
      afterSignOutUrl="/"
      userProfileUrl="/me"
      userProfileMode="navigation"
      showName={true}
    />
  );
}
