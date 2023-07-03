import {TRPCClientError} from '@trpc/client';
import {toast} from 'react-hot-toast';
import {useConfirmDialog} from '../useConfirmDialog';
import {api} from '../../../../apps/web/src/trpc/client';
import {useRouter} from 'next/navigation';
import {useAmplitude} from '../useAmplitude';

interface Props {
  eventId?: string;
}

export function useUnpublishEvent({eventId}: Props) {
  const router = useRouter();
  const {logEvent} = useAmplitude();

  const {modal, open, isPending} = useConfirmDialog({
    title: 'Are you sure you want to unpublish event?',
    description:
      'This event will not be available to anyone when visiting public link.',
    onConfirm: async () => {
      if (eventId) {
        await api.event.publish.mutate({eventId, isPublished: false});
        toast.success(`Event is successfully unpublished!`);
        logEvent('event_unpublished', {eventId});
        router.refresh();
      } else {
        throw new TRPCClientError('Event ID is not provided');
      }
    },
  });

  const onUnpublishClick = () => {
    open();
  };

  return {modal, onUnpublishClick, isUnpublishing: isPending};
}
