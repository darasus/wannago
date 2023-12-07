'use client';

import {Badge, Button, CardBase} from 'ui';
import {use} from 'react';
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
  const {createAccountLink, isLoading: isCreating} = useCreateStripeAccount({
    organizerId,
  });
  const account = use(stripeAccountPromise);

  return (
    <CardBase
      title="Connect Stripe"
      titleChildren={
        account ? null : (
          <Button
            onClick={createAccountLink}
            disabled={isCreating}
            isLoading={isCreating}
            size="sm"
            variant={'link'}
            className="p-0"
          >
            Connect
          </Button>
        )
      }
    >
      {account && (
        <div className="flex items-center gap-2">
          <div>
            <div>{`ID: ${account.id}`}</div>
            <div>{`Name: ${account.name}`}</div>
            <div>{`Email: ${account.email}`}</div>
          </div>
          <div className="grow" />
          <Badge className="bg-green-500 hover:bg-green-600">Linked</Badge>
        </div>
      )}
      {!account && <span>No stripe account is linked</span>}
    </CardBase>
  );
}
