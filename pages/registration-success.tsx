import {useUser} from '@clerk/nextjs';
import {buildClerkProps, clerkClient, getAuth} from '@clerk/nextjs/server';
import {GetServerSidePropsContext} from 'next';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {trpc} from '../utils/trpc';

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const {user, isSignedIn} = useUser();
  const setupUser = trpc.user.setupUser.useMutation();

  useEffect(() => {
    if (isSignedIn) {
      setupUser
        .mutateAsync({
          email: user.primaryEmailAddress?.emailAddress!,
          firstName: user.firstName!,
          lastName: user.lastName!,
        })
        .then(() => {
          router.push('/dashboard');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return null;
}
