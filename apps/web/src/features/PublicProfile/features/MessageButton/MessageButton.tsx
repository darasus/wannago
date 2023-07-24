'use client';

import {Button} from 'ui';
import {useParams} from 'next/dist/client/components/navigation';
import {useRouter} from 'next/navigation';
import {toast} from 'react-hot-toast';
import {useTransition} from 'react';
import {api} from '../../../../trpc/client';

interface Props {}

export function MessageButton({}: Props) {
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.organizationId as string | undefined;
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      isLoading={isPending}
      onClick={async () => {
        startTransition(async () => {
          const me = await api.user.me.query();
          const userIds = [me?.id] as string[];

          if (!me?.id) {
            toast.error('To be able to message anyone you need to login first');
            return undefined;
          }

          if (me?.id === params?.userId) {
            toast.error('You cannot message yourself');
            return undefined;
          }

          if (typeof params?.userId === 'string') {
            userIds.push(params?.userId);
          }

          const conversation = await api.conversation.createConversation
            .mutate({
              userIds,
              organizationId,
            })
            .catch((error) => {
              toast.error(error.message);
            });

          if (conversation?.id) {
            router.push(`/messages/${conversation.id}`);
          }
        });
      }}
      data-testid="message-button"
    >
      Message
    </Button>
  );
}
