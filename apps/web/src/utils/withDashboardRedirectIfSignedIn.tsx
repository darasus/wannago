import {useAuth} from '@clerk/nextjs';
import {useMe} from 'hooks';
import {NextComponentType} from 'next';
import {useRouter} from 'next/router';
import {useEffect} from 'react';

export function withDashboardRedirectIfSignedIn(
  Component: NextComponentType<any, any, any>
) {
  return function Render(props: any) {
    const router = useRouter();
    const {auth} = useMe();

    useEffect(() => {
      if (auth.isSignedIn) {
        router.push('/dashboard', undefined, {unstable_skipClientCache: true});
      }
    }, [auth, router]);

    if (auth.isSignedIn) return null;

    return <Component {...props} />;
  };
}
