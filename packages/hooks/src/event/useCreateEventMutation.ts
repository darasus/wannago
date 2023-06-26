import {useRouter} from 'next/navigation';
import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {useAmplitude} from '../useAmplitude';

export function useCreateEventMutation() {
  const router = useRouter();
  const {logEvent} = useAmplitude();

  return trpc.event.create.useMutation({
    onSuccess(data) {
      logEvent('event_created', {
        eventId: data?.id,
      });
      if (data?.id) {
        router.push(`/e/${data.shortId}`);
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });
}
