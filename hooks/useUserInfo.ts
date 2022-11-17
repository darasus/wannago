import {useUser} from '@clerk/nextjs';

export function useUserInfo() {
  const {isLoaded, isSignedIn, user} = useUser();

  return {isLoaded, isSignedIn, user};
}
