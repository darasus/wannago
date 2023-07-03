'use client';

import {useTransition} from 'react';
import {api} from '../../../../trpc/client';
import {toast} from 'react-hot-toast';
import {captureException} from '@sentry/nextjs';

export function useRedirectToStripeAccount({type}: {type: 'PRO' | 'BUSINESS'}) {
  const [isPending, startTransition] = useTransition();

  const redirectToStripeAccount = async () => {
    try {
      startTransition(async () => {
        const url = await api.stripeAccountLink.getAccountLink
          .mutate({type})
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
