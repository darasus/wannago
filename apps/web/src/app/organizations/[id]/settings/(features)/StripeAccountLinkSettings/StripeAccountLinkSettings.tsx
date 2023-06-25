'use client';

import {captureException, captureMessage} from '@sentry/nextjs';
import {useRouter} from 'next/navigation';
import {toast} from 'react-hot-toast';
import {Button, CardBase} from 'ui';
import {api} from '../../../../../../trpc/client';
import {use, useTransition} from 'react';

interface Props {
  type: 'PRO' | 'BUSINESS';
}

export function StripeAccountLinkSettings({type}: Props) {
  const [isCreateAccountLinkPending, startCreateAccountLinkTransition] =
    useTransition();
  const [isUpdateAccountLinkPending, startUpdateAccountLinkTransition] =
    useTransition();
  const router = useRouter();
  const subscription = use(
    api.subscriptionPlan.getMySubscription.query({type})
  );
  const account = use(
    api.stripeAccountLink.getAccount.query({
      type,
    })
  );

  const handleCreateAccountLink = async () => {
    try {
      const url = await api.stripeAccountLink.createAccountLink
        .mutate({type})
        .catch(error => {
          toast.error(error.message);
        });

      if (url) {
        captureMessage(url);
        router.push(url);
      }
    } catch (error) {
      captureException(error, {
        extra: {
          type,
          function: 'createAccountLink',
        },
      });
    }
  };

  const handleUpdateAccountLink = async () => {
    try {
      const url = await api.stripeAccountLink.getAccountLink
        .mutate({type})
        .catch(error => {
          toast.error(error.message);
        });
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      captureException(error, {
        extra: {
          type,
          function: 'getAccountLink',
        },
      });
    }
  };

  if (subscription?.type !== type) {
    return null;
  }

  return (
    <CardBase title={account ? 'Linked Stripe account' : 'Link Stripe account'}>
      {account && (
        <div className="flex flex-col gap-2">
          <div>
            <div>Account ID: {account.id}</div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleUpdateAccountLink}
              isLoading={isUpdateAccountLinkPending}
              size="sm"
            >
              View account
            </Button>
          </div>
        </div>
      )}
      {!account && (
        <Button
          onClick={handleCreateAccountLink}
          isLoading={isCreateAccountLinkPending}
          size="sm"
        >
          Link Stripe account
        </Button>
      )}
    </CardBase>
  );
}
