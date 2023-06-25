'use client';

import {Button} from 'ui';
import {api} from '../../../../../trpc/client';
import {useParams} from 'next/dist/client/components/navigation';
import {useRouter} from 'next/navigation';
import {toast} from 'react-hot-toast';
import {useTransition} from 'react';

interface Props {}

export function MessageButton({}: Props) {
  const router = useRouter();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="neutral"
      isLoading={isPending}
      onClick={async () => {
        startTransition(async () => {
          const me = await api.user.me.query();
          const myOrganization =
            await api.organization.getMyOrganization.query();
          const organizationIds = [] as string[];
          const userIds = [me?.id] as string[];

          // TODO move this to procedure
          if (!me?.id && !myOrganization?.id) {
            toast.error('To be able to message anyone you need to login first');
            return undefined;
          }

          if (me?.id === params?.userId) {
            toast.error('You cannot message yourself');
            return undefined;
          }
          if (
            myOrganization?.id &&
            myOrganization?.id === params?.organizationId
          ) {
            toast.error('You cannot message your own organization');
            return undefined;
          }

          if (typeof params?.userId === 'string') {
            userIds.push(params?.userId);
          }

          if (typeof params?.organizationId === 'string') {
            organizationIds.push(params?.organizationId);
          }

          const conversation = await api.conversation.createConversation
            .mutate({
              userIds,
              organizationIds,
            })
            .catch(error => {
              toast.error(error.message);
            });

          if (conversation?.id) {
            router.push(`/messages/${conversation.id}`);
          }
        });
      }}
      className="w-full md:w-40"
      data-testid="message-button"
    >
      Message
    </Button>
  );
}
