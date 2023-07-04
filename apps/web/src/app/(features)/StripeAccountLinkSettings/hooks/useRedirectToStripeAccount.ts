'use client';

import {useTransition} from 'react';
import {api} from '../../../../trpc/client';
import {toast} from 'react-hot-toast';
import {captureException} from '@sentry/nextjs';
import {useAmplitude} from 'hooks';
import {useParams} from 'next/navigation';

export function useRedirectToStripeAccount({type}: {type: 'PRO' | 'BUSINESS'}) {
  const params = useParams();
  const {logEvent} = useAmplitude();
  const [isPending, startTransition] = useTransition();

  const redirectToStripeAccount = async () => {
    logEvent('view_stripe_account_button_clicked', {
      extra: {
        type,
      },
    });
    try {
      startTransition(async () => {
        const url = await api.stripeAccountLink.getAccountLink
          .mutate({
            organizerId: (params?.organizationId || params?.userId) as string,
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
          type,
          function: 'getAccountLink',
        },
      });
    }
  };

  return {redirectToStripeAccount, isLoading: isPending};
}
