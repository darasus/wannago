"use client";

import { useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "ui";
import { useParams } from "next/navigation";
import { User } from "@prisma/client";
import { api } from "../../../../../trpc/client";
import { useRouter } from "next/navigation";
import { z } from "zod";

interface Props {
  me: User;
}

const formScheme = z.object({
  text: z.string().nonempty(),
});

export function MessageInput({ me }: Props) {
  const router = useRouter();
  const params = useParams();
  const conversationId = params?.conversationId as string;
  const form = useForm<z.infer<typeof formScheme>>();

  const handleSubmit = form.handleSubmit(async (data) => {
    await api.conversation.sendMessage.mutate({
      conversationId,
      text: data.text,
      senderId: me?.id as string,
    });
    router.refresh();
    form.reset();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <div className="grow">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type your message here...</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="message-input" />
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
