import {useConfirmDialog, useTracker} from 'hooks';
import {useRouter} from 'next/navigation';
import {api} from '../../../../../../../../../apps/web/src/trpc/client';
import {Event} from '@prisma/client';
import {revalidateGetMySignUp} from '../../../../../../../../../apps/web/src/actions';
import {toast} from 'sonner';

interface Props {
  event: Event;
}

export function useCancelEvent({event}: Props) {
  const router = useRouter();
  const {logEvent} = useTracker();

  const {modal: cancelModal, open: cancelEvent} = useConfirmDialog({
    title: 'Confirm cancellation',
    description: 'Are you sure you want to cancel your attendance?',
    onConfirm: async () => {
      const promise = api.event.cancelEvent
        .mutate({
          eventId: event.id,
        })
        .then(async () => {
          await revalidateGetMySignUp({eventId: event.id});
          router.refresh();
          logEvent('event_sign_up_cancel_submitted', {
            eventId: event.id,
          });
        });

      toast.promise(promise, {
        loading: 'Cancelling sign up...',
        success: 'Sign up is cancelled!',
        error: (error) => error.message,
      });

      try {
        await promise;
      } catch (error) {}
    },
  });

  return {cancelEvent, cancelModal};
}
