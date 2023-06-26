import {captureException} from '@sentry/nextjs';
import {TRPCClientError} from '@trpc/client';
import {useRouter} from 'next/navigation';
import {useCallback} from 'react';
import {trpc} from 'trpc/src/trpc';

const subscriptionMap = {
  PRO: 'wannago_pro',
  BUSINESS: 'wannago_business',
} as const;

export function useSubscription({type}: {type: 'PRO' | 'BUSINESS'}) {
  const router = useRouter();
  const checkoutSession = trpc.subscription.createCheckoutSession.useMutation();
  const customerPortalSession =
    trpc.subscription.createCustomerPortalSession.useMutation();
  const subscription = trpc.subscription.getMySubscription.useQuery({type});

  const handleCreateCheckoutSession = useCallback(() => {
    checkoutSession.mutateAsync({plan: subscriptionMap[type]}).then(url => {
      if (url) {
        router.push(url);
      } else {
        captureException(new TRPCClientError('No checkout session URL'));
      }
    });
  }, [checkoutSession, router, type]);

  const handleCreatePortalSession = useCallback(() => {
    customerPortalSession
      .mutateAsync({plan: subscriptionMap[type]})
      .then(url => {
        if (url) {
          router.push(url);
        } else {
          captureException(new TRPCClientError('No portal session URL'));
        }
      });
  }, [customerPortalSession, router, type]);

  return {
    subscription,
    checkoutSession,
    customerPortalSession,
    handleCreateCheckoutSession,
    handleCreatePortalSession,
  };
}
