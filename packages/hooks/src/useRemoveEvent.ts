import {useRouter} from 'next/router';
import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {useAmplitude} from './useAmplitude';
import {useConfirmDialog} from './useConfirmDialog';

interface Props {
  eventId: string;
}

export function useRemoveEvent({eventId}: Props) {
  const {logEvent} = useAmplitude();
  const router = useRouter();
  const {mutateAsync, isLoading} = trpc.event.remove.useMutation({
    onSuccess: () => {
      toast.success(`Event is successfully removed!`);
      router.push('/dashboard');
    },
  });

  const {modal, open} = useConfirmDialog({
    title: 'Are you sure you want to remove event?',
    description:
      'This is irreversible and all event related data will be removed.',
    onConfirm: async () => {
      await mutateAsync({eventId});
      logEvent('event_deleted', {eventId});
    },
  });

  const onRemoveClick = () => {
    open();
  };

  return {modal, onRemoveClick, isRemoving: isLoading};
}
