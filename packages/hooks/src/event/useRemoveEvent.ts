import {TRPCClientError} from '@trpc/client';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {useConfirmDialog} from '../useConfirmDialog';
import {api} from '../../../../apps/web/src/trpc/client';
import {useTracker} from '../useTracker';

interface Props {
  eventId?: string;
}

export function useRemoveEvent({eventId}: Props) {
  const {logEvent} = useTracker();
  const router = useRouter();

  const {modal, open, isPending} = useConfirmDialog({
    title: 'Are you sure you want to remove event?',
    description:
      'This is irreversible and all event related data will be removed.',
    onConfirm: async () => {
      if (eventId) {
        await api.event.remove
          .mutate({eventId})
          .then(() => {
            toast.success(`Event is successfully removed!`);
            router.push('/dashboard');
            logEvent('event_deleted', {eventId});
          })
          .catch((error) => {
            toast.error(error.message);
          });
      } else {
        throw new TRPCClientError('Event ID is not provided');
      }
    },
  });

  const onRemoveClick = () => {
    open();
  };

  return {modal, onRemoveClick, isRemoving: isPending};
}
