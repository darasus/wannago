import {trpc} from 'trpc/src/trpc';
import {Badge, Button, CardBase, LoadingBlock, Text} from 'ui';

export function UserSubscription() {
  const proSubscriptionLink =
    trpc.subscription.getProSubscriptionLink.useQuery();
  const customerPortalLink = trpc.subscription.getCustomerPortalLink.useQuery();
  const mySubscription = trpc.subscription.getMySubscription.useQuery();

  const isPro = mySubscription.data?.type === 'PRO';

  if (
    mySubscription.isLoading ||
    customerPortalLink.isLoading ||
    proSubscriptionLink.isLoading
  ) {
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
          {isPro && customerPortalLink.data && (
            <Button
              as="a"
              size="xs"
              href={customerPortalLink.data}
              variant="neutral"
            >
              Manage
            </Button>
          )}
          {!isPro && proSubscriptionLink.data && (
            <Button as="a" href={proSubscriptionLink.data} size="xs">
              Upgrade to PRO
            </Button>
          )}
        </div>
      </CardBase>
    </>
  );
}
