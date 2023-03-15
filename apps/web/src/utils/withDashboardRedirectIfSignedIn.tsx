import {useAuth} from '@clerk/nextjs';
import {NextComponentType} from 'next';
import {useRouter} from 'next/router';
import {useEffect} from 'react';

export function withDashboardRedirectIfSignedIn(
  Component: NextComponentType<any, any, any>
) {
  return function Render(props: any) {
    const router = useRouter();
    const {isSignedIn} = useAuth();

    useEffect(() => {
      if (isSignedIn) {
        router.push('/dashboard', undefined, {unstable_skipClientCache: true});
      }
    }, [isSignedIn, router]);

    if (isSignedIn) return null;

    return <Component {...props} />;
  };
}
