'use client';

import {useTransition} from 'react';
import {api} from '../../../trpc/client';
import {toast} from 'sonner';
import {useRouter} from 'next/navigation';
import {useTracker} from 'hooks';

export function useCreateStripeAccount({organizerId}: {organizerId: string}) {
  const {logEvent} = useTracker();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const createAccountLink = async () => {
    logEvent('link_stripe_account_button_clicked', {
      organizerId,
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
      console.error(error, {
        extra: {
          organizerId,
          function: 'createAccountLink',
        },
      });
    }
  };

  return {createAccountLink, isLoading: isPending};
}
