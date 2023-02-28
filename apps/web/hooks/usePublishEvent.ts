import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {useAmplitude} from './useAmplitude';
import {useConfetti} from './useConfetti';
import {useConfirmDialog} from './useConfirmDialog';

interface Props {
  eventId: string;
}

export function usePublishEvent({eventId}: Props) {
  const {confetti} = useConfetti();
  const {logEvent} = useAmplitude();
  const {mutateAsync, isLoading} = trpc.event.publish.useMutation({
    onSuccess: () => {
      toast.success(`Event is successfully published!`);
    },
  });
  const {refetch} = trpc.event.getById.useQuery({eventId}, {enabled: false});

  const {modal, open} = useConfirmDialog({
    title: 'Are you sure you want to publish event?',
    description:
      'This event will be available to everyone when visiting public link.',
    onConfirm: async () => {
      await mutateAsync({eventId, isPublished: true});
      confetti();
      logEvent('event_published', {eventId});
      await refetch();
    },
  });

  const onPublishClick = () => {
    open();
  };

  return {modal, onPublishClick, isPublishing: isLoading};
}
