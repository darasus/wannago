'use client';

import {useTransition} from 'react';
import {api} from '../../../trpc/client';
import {toast} from 'sonner';
import {captureException} from '@sentry/nextjs';
import {useAmplitude} from 'hooks';

export function useRedirectToStripeAccount({
  organizerId,
}: {
  organizerId: string;
}) {
  const {logEvent} = useAmplitude();
  const [isPending, startTransition] = useTransition();

  const redirectToStripeAccount = async () => {
    logEvent('view_stripe_account_button_clicked', {
      extra: {
        organizerId,
      },
    });
    try {
      startTransition(async () => {
        const url = await api.stripeAccountLink.getAccountLink
          .mutate({
            organizerId,
          })
          .catch((error) => {
            toast.error(error.message);
          });
        if (url) {
          window.open(url, '_blank');
        }
      });
    } catch (error) {
      captureException(error, {
        extra: {
          organizerId,
          function: 'getAccountLink',
        },
      });
    }
  };

  return {redirectToStripeAccount, isLoading: isPending};
}
