import {Event} from '@prisma/client';
import {useConfetti, useTracker} from 'hooks';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';

import {api} from '../../../../../../../apps/web/src/trpc/server-http';
import {EventSignUpForm} from '../validation';

import {useCodeModalState} from './useCodeModalState';

interface Props {
  event: Event;
}

export function useAttendEvent({event}: Props) {
  const router = useRouter();
  const {confetti} = useConfetti();
  const {logEvent} = useTracker();
  const {close: closeCodeModal} = useCodeModalState();

  const attendEvent = async (data: EventSignUpForm) => {
    const promise = api.event.joinEvent
      .mutate({
        eventId: event.id,
        hasPlusOne: data.hasPlusOne,
        code: data.code,
      })
      .then(async () => {
        router.refresh();
        confetti();
        logEvent('event_sign_up_submitted', {
          eventId: event.id,
        });
      });

    toast.promise(promise, {
      loading: 'Signing up...',
      success: 'Signed up! Check your email for more details.',
      error: (error) => error.message,
    });

    closeCodeModal();

    try {
      await promise;
    } catch (error) {}
  };

  return {attendEvent};
}
