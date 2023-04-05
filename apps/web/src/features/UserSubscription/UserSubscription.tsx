import {useMyUserQuery, useSubscription} from 'hooks';
import {Badge, Button, CardBase, LoadingBlock, Text} from 'ui';
import {formatDate} from 'utils';

export function UserSubscription() {
  const me = useMyUserQuery();
  const {
    subscription,
    handleCreateCheckoutSession,
    handleCreatePortalSession,
    checkoutSession,
    customerPortalSession,
  } = useSubscription({type: 'PRO'});
  const hasPaidSubscription = Boolean(subscription.data);
  const subscriptionTypeLabel = subscription.data?.type || 'STARTER';

  if (subscription.isLoading || me.isLoading) {
    return (
      <CardBase>
        <LoadingBlock />
      </CardBase>
    );
  }

  return (
    <>
      <CardBase title="Subscription">
        <div className="flex items-center">
          <div className="flex items-center grow gap-1">
            <Text>WannaGo</Text>
            <Badge color={hasPaidSubscription ? 'green' : 'gray'} size="xs">
              {subscriptionTypeLabel}
            </Badge>
            {subscription.data?.cancelAt && (
              <Badge size="xs">
                {`Expires ${formatDate(
                  subscription.data?.cancelAt,
                  'd MMM yyyy'
                )}`}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {!hasPaidSubscription && (
              <>
                <Button
                  size="xs"
                  onClick={handleCreateCheckoutSession}
                  isLoading={checkoutSession.isLoading}
                  variant="success"
                >
                  Upgrade to PRO
                </Button>
              </>
            )}
            {me.data?.stripeCustomerId && (
              <Button
                size="xs"
                variant="neutral"
                onClick={handleCreatePortalSession}
                isLoading={customerPortalSession.isLoading}
              >
                Manage
              </Button>
            )}
          </div>
        </div>
      </CardBase>
    </>
  );
}
