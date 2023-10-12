import {useConfetti, useMe, useTracker} from 'hooks';
import {EventSignUpForm} from '../../../types';
import {useRouter} from 'next/navigation';
import {api} from '../../../../../../../../../apps/web/src/trpc/client';
import {Event} from '@prisma/client';
import {revalidateGetMySignUp} from '../../../../../../../../../apps/web/src/actions';
import {toast} from 'sonner';

interface Props {
  event: Event;
}

export function useAttendEvent({event}: Props) {
  const me = useMe();
  const router = useRouter();
  const {confetti} = useConfetti();
  const {logEvent} = useTracker();

  const attendEvent = async (data: EventSignUpForm) => {
    if (!me) {
      router.push('/sign-in');
    }

    const promise = api.event.joinEvent
      .mutate({
        eventId: event.id,
        hasPlusOne: data.hasPlusOne,
      })
      .then(async () => {
        await revalidateGetMySignUp({eventId: event.id});
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

    try {
      await promise;
    } catch (error) {}
  };

  return {attendEvent};
}
