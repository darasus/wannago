import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {useAmplitude} from '../useAmplitude';
import {useConfetti} from '../useConfetti';
import {useConfirmDialog} from '../useConfirmDialog';
import {useEventId} from '../event/useEventId';
import {TRPCClientError} from '@trpc/client';

interface Props {
  eventId?: string;
}

export function usePublishEvent({eventId}: Props) {
  const {confetti} = useConfetti();
  const {logEvent} = useAmplitude();
  const {eventShortId} = useEventId();
  const {mutateAsync, isLoading} = trpc.event.publish.useMutation({
    onSuccess: () => {
      toast.success(`Event is successfully published!`);
    },
  });
  const {refetch} = trpc.event.getByShortId.useQuery(
    {id: eventShortId!},
    {enabled: !!eventShortId}
  );

  const {modal, open} = useConfirmDialog({
    title: 'Are you sure you want to publish event?',
    description:
      'This event will be available to everyone when visiting public link.',
    onConfirm: async () => {
      if (eventId) {
        await mutateAsync({eventId, isPublished: true});
        confetti();
        logEvent('event_published', {eventId});
        await refetch();
      } else {
        throw new TRPCClientError('Event ID is not provided');
      }
    },
  });

  const onPublishClick = () => {
    open();
  };

  return {modal, onPublishClick, isPublishing: isLoading};
}
