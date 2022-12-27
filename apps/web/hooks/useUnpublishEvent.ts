import {toast} from 'react-hot-toast';
import {trpc} from '../utils/trpc';
import {useConfirmDialog} from './useConfirmDialog';

interface Props {
  eventId: string;
}

export function useUnpublishEvent({eventId}: Props) {
  const {mutateAsync, isLoading} = trpc.event.publish.useMutation({
    onSuccess: () => {
      toast.success(`Event is successfully unpublished!`);
    },
  });

  const {refetch} = trpc.event.getById.useQuery({eventId}, {enabled: false});

  const {modal, open} = useConfirmDialog({
    title: 'Are you sure you want to unpublish event?',
    description:
      'This event will not be available to anyone when visiting public link.',
    onConfirm: async () => {
      await mutateAsync({eventId, isPublished: false});
      await refetch();
    },
  });

  const onUnpublishClick = () => {
    open();
  };

  return {modal, onUnpublishClick, isUnpublishing: isLoading};
}
