'use client';

import {useForm} from 'react-hook-form';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from 'ui';
import {useParams, useRouter} from 'next/navigation';
import {User} from '@prisma/client';
import {z} from 'zod';
import {api} from '../../../../../trpc/client';
import {revalidateGetConversationById} from '../../../../../actions';

interface Props {
  me: User;
}

const formScheme = z.object({
  text: z.string().nonempty(),
});

export function MessageInput({me}: Props) {
  const router = useRouter();
  const params = useParams();
  const conversationId = params?.conversationId as string;
  const form = useForm<z.infer<typeof formScheme>>({
    defaultValues: {
      text: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await api.conversation.sendMessage
      .mutate({
        conversationId,
        text: data.text,
        senderId: me?.id as string,
      })
      .then(async () => {
        await revalidateGetConversationById({conversationId});
        router.refresh();
        form.resetField('text');
      });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <div className="grow">
            <FormField
              control={form.control}
              name="text"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      data-testid="message-input"
                      placeholder="Type your message here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            isLoading={form.formState.isSubmitting}
            data-testid="message-form-submit-button"
          >
            Send
          </Button>
        </div>
      </form>
    </Form>
  );
}
