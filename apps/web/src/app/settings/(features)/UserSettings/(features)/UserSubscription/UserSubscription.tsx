'use client';

import {User} from '@prisma/client';
import {Badge, Button, CardBase, Text} from 'ui';
import {formatDate} from 'utils';
import {RouterOutputs, api} from '../../../../../../trpc/client';
import {use} from 'react';
import {useRouter} from 'next/navigation';
import {captureException} from '@sentry/nextjs';
import {TRPCClientError} from '@trpc/client';

interface Props {
  user: User;
  mySubscriptionPromise: Promise<
    RouterOutputs['subscriptionPlan']['getMySubscription']
  >;
}

const subscriptionMap = {
  PRO: 'wannago_pro',
  BUSINESS: 'wannago_business',
} as const;

export function UserSubscription({user, mySubscriptionPromise}: Props) {
  const router = useRouter();
  const subscription = use(mySubscriptionPromise);
  const hasPaidSubscription = Boolean(subscription);
  const subscriptionTypeLabel = subscription?.type || 'STARTER';

  return (
    <>
      <CardBase title="Subscription">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex items-center grow gap-1">
            {hasPaidSubscription && (
              <>
                <Text>WannaGo</Text>
                <Badge color={hasPaidSubscription ? 'green' : 'gray'} size="xs">
                  {subscriptionTypeLabel}
                </Badge>
                {subscription?.cancelAt && (
                  <Badge size="xs">
                    {`Expires ${formatDate(
                      subscription?.cancelAt,
                      'd MMM yyyy'
                    )}`}
                  </Badge>
                )}
              </>
            )}
            {!hasPaidSubscription && <Text>No active subscription</Text>}
          </div>
          <div className="flex gap-2">
            {!hasPaidSubscription && (
              <>
                <Button
                  size="xs"
                  onClick={async () => {
                    await api.subscriptionPlan.createCheckoutSession
                      .mutate({plan: subscriptionMap['PRO']})
                      .then(url => {
                        if (url) {
                          router.push(url);
                        } else {
                          captureException(
                            new TRPCClientError('No checkout session URL')
                          );
                        }
                      });
                  }}
                  variant="success"
                >
                  Upgrade to PRO
                </Button>
              </>
            )}
            {user.stripeCustomerId && (
              <Button
                size="xs"
                variant="neutral"
                onClick={async () => {
                  await api.subscriptionPlan.createCustomerPortalSession
                    .mutate({
                      plan: subscriptionMap['PRO'],
                    })
                    .then(url => {
                      if (url) {
                        router.push(url);
                      } else {
                        captureException(
                          new TRPCClientError('No portal session URL')
                        );
                      }
                    });
                }}
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
