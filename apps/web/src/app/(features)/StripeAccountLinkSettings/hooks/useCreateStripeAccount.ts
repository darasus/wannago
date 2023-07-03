'use client';

import {useTransition} from 'react';
import {api} from '../../../../trpc/client';
import {toast} from 'react-hot-toast';
import {captureException} from '@sentry/nextjs';
import {useRouter} from 'next/navigation';

export function useCreateStripeAccount({type}: {type: 'PRO' | 'BUSINESS'}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const createAccountLink = async () => {
    try {
      startTransition(async () => {
        const url = await api.stripeAccountLink.createAccountLink
          .mutate({type})
          .catch((error) => {
            toast.error(error.message);
          });

        if (url) {
          router.push(url);
        }
      });
    } catch (error) {
      captureException(error, {
        extra: {
          type,
          function: 'createAccountLink',
        },
      });
    }
  };

  return {createAccountLink, isLoading: isPending};
}
