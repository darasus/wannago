import {toast} from 'react-hot-toast';
import {useConfetti} from '../useConfetti';
import {useConfirmDialog} from '../useConfirmDialog';
import {TRPCClientError} from '@trpc/client';
import {useRouter} from 'next/navigation';
import {api} from '../../../../apps/web/src/trpc/client';
import {useAmplitude} from '../useAmplitude';

interface Props {
  eventId?: string;
}

export function usePublishEvent({eventId}: Props) {
  const router = useRouter();
  const {confetti} = useConfetti();
  const {logEvent} = useAmplitude();

  const {modal, open, isPending} = useConfirmDialog({
    title: 'Are you sure you want to publish event?',
    description:
      'This event will be available to everyone when visiting public link.',
    onConfirm: async () => {
      if (eventId) {
        await api.event.publish
          .mutate({eventId, isPublished: true})
          .then(() => {
            toast.success(`Event is successfully published!`);
            confetti();
            logEvent('event_published', {eventId});
          })
          .catch((error) => {
            toast.error(error.message);
          });
        router.refresh();
      } else {
        throw new TRPCClientError('Event ID is not provided');
      }
    },
  });

  const onPublishClick = () => {
    open();
  };

  return {modal, onPublishClick, isPublishing: isPending};
}
