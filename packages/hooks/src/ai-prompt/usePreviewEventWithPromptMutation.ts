import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';

export function usePreviewEventWithPromptMutation() {
  return trpc.event.previewEventWithPrompt.useMutation({
    onError: error => {
      toast.error(error.message);
    },
  });
}
