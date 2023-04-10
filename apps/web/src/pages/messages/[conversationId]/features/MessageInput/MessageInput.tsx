import {useRouter} from 'next/router';
import {useForm} from 'react-hook-form';
import {trpc} from 'trpc/src/trpc';
import {Input} from '../../../../../components/Input/Input/Input';
import {useCurrentAuthorId} from 'hooks';
import {Button} from 'ui';

interface Form {
  text: string;
}

export function MessageInput() {
  const {authorId} = useCurrentAuthorId();
  const router = useRouter();
  const conversationId = router.query.conversationId as string;
  const form = useForm<Form>();
  const {mutateAsync} = trpc.conversation.sendMessage.useMutation();
  const {refetch} = trpc.conversation.getConversationById.useQuery({
    conversationId,
  });

  const handleSubmit = form.handleSubmit(async data => {
    await mutateAsync({
      conversationId,
      text: data.text,
      senderId: authorId!,
    });
    await refetch();
    form.reset();
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <div className="grow">
          <Input
            {...form.register('text')}
            placeholder="Type your message here..."
            disabled={form.formState.isSubmitting}
          />
        </div>
        <Button type="submit" isLoading={form.formState.isSubmitting}>
          Send
        </Button>
      </div>
    </form>
  );
}
