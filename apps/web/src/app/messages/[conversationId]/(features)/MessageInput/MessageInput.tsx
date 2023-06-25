'use client';

import {useForm} from 'react-hook-form';
import {Input} from '../../../../../components/Input/Input/Input';
import {Button} from 'ui';
import {useParams} from 'next/navigation';
import {User} from '@prisma/client';
import {api} from '../../../../../trpc/client';
import {useRouter} from 'next/navigation';

interface Form {
  text: string;
}

interface Props {
  me: User;
}

export function MessageInput({me}: Props) {
  const router = useRouter();
  const params = useParams();
  const conversationId = params?.conversationId as string;
  const form = useForm<Form>();

  const handleSubmit = form.handleSubmit(async data => {
    await api.conversation.sendMessage.mutate({
      conversationId,
      text: data.text,
      senderId: me?.id as string,
    });
    router.refresh();
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
            data-testid="message-input"
          />
        </div>
        <Button
          type="submit"
          isLoading={form.formState.isSubmitting}
          data-testid="message-form-submit-button"
        >
          Send
        </Button>
      </div>
    </form>
  );
}
