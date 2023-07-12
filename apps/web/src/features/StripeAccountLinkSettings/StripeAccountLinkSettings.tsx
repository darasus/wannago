'use client';

import {Badge, Button, CardBase} from 'ui';
import {use} from 'react';
import {useRedirectToStripeAccount} from './hooks/useRedirectToStripeAccount';
import {useCreateStripeAccount} from './hooks/useCreateStripeAccount';
import {RouterOutputs} from 'api';

interface Props {
  organizerId: string;
  stripeAccountPromise: Promise<
    RouterOutputs['stripeAccountLink']['getAccount']
  >;
}

export function StripeAccountLinkSettings({
  organizerId,
  stripeAccountPromise,
}: Props) {
  const {isLoading: isRedirecting, redirectToStripeAccount} =
    useRedirectToStripeAccount({
      organizerId,
    });
  const {createAccountLink, isLoading: isCreating} = useCreateStripeAccount({
    organizerId,
  });
  const account = use(stripeAccountPromise);

  return (
    <CardBase
      title="Connect Stripe"
      titleChildren={
        account ? (
          <Button
            onClick={redirectToStripeAccount}
            disabled={isRedirecting}
            isLoading={isRedirecting}
            size="sm"
            variant={'link'}
          >
            View Stripe account
          </Button>
        ) : (
          <Button
            onClick={createAccountLink}
            disabled={isCreating}
            isLoading={isCreating}
            size="sm"
            variant={'link'}
          >
            Connect
          </Button>
        )
      }
    >
      {account && (
        <div className="flex items-center gap-2">
          <div>
            <div>Account ID: {account.id}</div>
          </div>
          <div className="grow" />
          <Badge className="bg-green-500 hover:bg-green-600">Linked</Badge>
        </div>
      )}
      {!account && <span>No stripe account is linked</span>}
    </CardBase>
  );
}
