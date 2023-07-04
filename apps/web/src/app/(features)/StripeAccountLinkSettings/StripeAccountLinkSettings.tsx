'use client';

import {Button, CardBase} from 'ui';
import {api} from '../../../trpc/client';
import {use} from 'react';
import {useRedirectToStripeAccount} from './hooks/useRedirectToStripeAccount';
import {useCreateStripeAccount} from './hooks/useCreateStripeAccount';

interface Props {
  organizerId: string;
}

export function StripeAccountLinkSettings({organizerId}: Props) {
  const {isLoading: isRedirecting, redirectToStripeAccount} =
    useRedirectToStripeAccount({
      organizerId,
    });
  const {createAccountLink, isLoading: isCreating} = useCreateStripeAccount({
    organizerId,
  });

  const account = use(
    api.stripeAccountLink.getAccount.query({
      organizerId,
    })
  );

  return (
    <CardBase title={account ? 'Linked Stripe account' : 'Link Stripe account'}>
      {account && (
        <div className="flex flex-col gap-2">
          <div>
            <div>Account ID: {account.id}</div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={redirectToStripeAccount}
              disabled={isRedirecting}
              isLoading={isRedirecting}
              size="sm"
            >
              View Stripe account
            </Button>
          </div>
        </div>
      )}
      {!account && (
        <Button
          onClick={createAccountLink}
          disabled={isCreating}
          isLoading={isCreating}
          size="sm"
        >
          Link Stripe account
        </Button>
      )}
    </CardBase>
  );
}
