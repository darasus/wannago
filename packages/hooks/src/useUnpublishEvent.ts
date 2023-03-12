import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {useAmplitude} from './useAmplitude';
import {useConfirmDialog} from './useConfirmDialog';
import {useEventId} from './useEventId';

interface Props {
  eventId: string;
}

export function useUnpublishEvent({eventId}: Props) {
  const {logEvent} = useAmplitude();
  const shortId = useEventId();
  const {mutateAsync, isLoading} = trpc.event.publish.useMutation({
    onSuccess: () => {
      toast.success(`Event is successfully unpublished!`);
    },
  });

  const {refetch} = trpc.event.getByShortId.useQuery(
    {id: shortId},
    {enabled: false}
  );

  const {modal, open} = useConfirmDialog({
    title: 'Are you sure you want to unpublish event?',
    description:
      'This event will not be available to anyone when visiting public link.',
    onConfirm: async () => {
      await mutateAsync({eventId, isPublished: false});
      logEvent('event_unpublished', {eventId});
      await refetch();
    },
  });

  const onUnpublishClick = () => {
    open();
  };

  return {modal, onUnpublishClick, isUnpublishing: isLoading};
}
