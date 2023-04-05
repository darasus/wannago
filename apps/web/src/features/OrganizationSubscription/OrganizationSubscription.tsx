import {useMyOrganizationQuery, useMyUserQuery, useSubscription} from 'hooks';
import {Badge, Button, CardBase, LoadingBlock, Text} from 'ui';
import {formatDate} from 'utils';

export function OrganizationSubscription() {
  const organization = useMyOrganizationQuery();
  const {
    subscription,
    handleCreateCheckoutSession,
    handleCreatePortalSession,
    checkoutSession,
    customerPortalSession,
  } = useSubscription({type: 'BUSINESS'});
  const hasPaidSubscription = Boolean(subscription.data);
  const subscriptionTypeLabel = subscription.data?.type || 'STARTER';

  if (subscription.isLoading || organization.isLoading) {
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
            {hasPaidSubscription && (
              <>
                <Text>WannaGo</Text>
                <Badge color={hasPaidSubscription ? 'green' : 'gray'} size="xs">
                  {subscriptionTypeLabel}
                </Badge>
              </>
            )}
            {!hasPaidSubscription && <Text>No active subscription</Text>}
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
                  Upgrade to BUSINESS
                </Button>
                {subscription.data?.cancelAt && (
                  <Badge size="xs">
                    {`Expires ${formatDate(
                      subscription.data?.cancelAt,
                      'd MMM yyyy'
                    )}`}
                  </Badge>
                )}
              </>
            )}
            {organization.data?.stripeCustomerId && (
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
