'use client';

import {Button} from 'ui';
import {useParams} from 'next/dist/client/components/navigation';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {useCreateConversation} from 'hooks';

export function MessageButton() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.organizationId as string | undefined;
  const {createConversation, isMutating} = useCreateConversation();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isMutating}
      isLoading={isMutating}
      onClick={async () => {
        const conversation = await createConversation({
          userId: params?.userId as string | undefined,
          organizationId,
        }).catch((error) => {
          toast.error(error.message);
        });

        if (conversation?.id) {
          router.push(`/messages/${conversation.id}`);
        }
      }}
      data-testid="message-button"
    >
      Message
    </Button>
  );
}
