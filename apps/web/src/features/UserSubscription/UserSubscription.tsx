import {captureException} from '@sentry/nextjs';
import {TRPCClientError} from '@trpc/client';
import {useRouter} from 'next/router';
import {useCallback} from 'react';
import {trpc} from 'trpc/src/trpc';
import {Badge, Button, CardBase, LoadingBlock, Text} from 'ui';

export function UserSubscription() {
  const router = useRouter();
  const checkoutSession = trpc.subscription.createCheckoutSession.useMutation();
  const customerPortalSession =
    trpc.subscription.createCustomerPortalSession.useMutation();
  const mySubscription = trpc.subscription.getMySubscription.useQuery();

  const isPro = mySubscription.data?.type === 'PRO';

  const handleCreateCheckoutSession = useCallback(() => {
    checkoutSession.mutateAsync({plan: 'wannago_pro'}).then(url => {
      if (url) {
        router.push(url);
      } else {
        captureException(new TRPCClientError('No checkout session URL'));
      }
    });
  }, [checkoutSession, router]);

  const handleCreatePortalSession = useCallback(() => {
    customerPortalSession.mutateAsync().then(url => {
      if (url) {
        router.push(url);
      } else {
        captureException(new TRPCClientError('No portal session URL'));
      }
    });
  }, [customerPortalSession, router]);

  if (mySubscription.isLoading) {
    return (
      <CardBase>
        <LoadingBlock />
      </CardBase>
    );
  }

  const subscriptionLabel = mySubscription.data?.type || 'STARTER';

  return (
    <>
      <CardBase title="Subscription">
        <div className="flex items-center">
          <div className="flex items-center grow gap-1">
            <Text>WannaGo</Text>
            <Badge color={isPro ? 'green' : 'gray'} size="xs">
              {subscriptionLabel}
            </Badge>
          </div>
          {isPro && (
            <Button
              size="xs"
              variant="neutral"
              onClick={handleCreatePortalSession}
              isLoading={customerPortalSession.isLoading}
            >
              Manage
            </Button>
          )}
          {!isPro && (
            <Button
              size="xs"
              onClick={handleCreateCheckoutSession}
              isLoading={checkoutSession.isLoading}
            >
              Upgrade to PRO
            </Button>
          )}
        </div>
      </CardBase>
    </>
  );
}
