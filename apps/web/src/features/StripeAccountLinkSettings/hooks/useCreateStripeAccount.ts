'use client';

import {useTransition} from 'react';
import {api} from '../../../trpc/client';
import {toast} from 'react-hot-toast';
import {captureException} from '@sentry/nextjs';
import {useRouter} from 'next/navigation';
import {useAmplitude} from 'hooks';

export function useCreateStripeAccount({organizerId}: {organizerId: string}) {
  const {logEvent} = useAmplitude();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const createAccountLink = async () => {
    logEvent('link_stripe_account_button_clicked', {
      extra: {
        organizerId,
      },
    });
    try {
      startTransition(async () => {
        const url = await api.stripeAccountLink.createAccountLink
          .mutate({
            organizerId,
          })
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
          organizerId,
          function: 'createAccountLink',
        },
      });
    }
  };

  return {createAccountLink, isLoading: isPending};
}
