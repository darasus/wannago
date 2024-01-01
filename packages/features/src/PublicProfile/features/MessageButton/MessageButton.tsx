'use client';

import {Button} from 'ui';
import {useParams} from 'next/dist/client/components/navigation';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {useState} from 'react';
import {api} from '../../../../../../apps/web/src/trpc/client';

export function MessageButton() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string | undefined;
  const organizationId = params?.organizationId as string | undefined;
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isLoading}
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        const conversation = await api.conversation.createConversation
          .mutate({userId, organizationId})
          .catch((error) => {
            toast.error(error.message);
          })
          .finally(() => {
            setIsLoading(false);
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
