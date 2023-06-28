import {TRPCClientError} from '@trpc/client';
import {useRouter} from 'next/navigation';
import {toast} from 'react-hot-toast';
import {useConfirmDialog} from '../useConfirmDialog';
import {api} from '../../../../apps/web/src/trpc/client';
import {useAmplitudeAppDir} from '../useAmplitudeAppDir';

interface Props {
  eventId?: string;
}

export function useRemoveEvent({eventId}: Props) {
  const {logEvent} = useAmplitudeAppDir();
  const router = useRouter();

  const {modal, open, isPending} = useConfirmDialog({
    title: 'Are you sure you want to remove event?',
    description:
      'This is irreversible and all event related data will be removed.',
    onConfirm: async () => {
      if (eventId) {
        await api.event.remove.mutate({eventId});
        toast.success(`Event is successfully removed!`);
        router.push('/dashboard');
        logEvent('event_deleted', {eventId});
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
