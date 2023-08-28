'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  Input,
  Textarea,
} from 'ui';
import {useTracker} from 'hooks';
import {useParams} from 'next/navigation';
import {api} from '../../../../../../../../trpc/client';
import {DialogTrigger} from '@radix-ui/react-dialog';

interface Form {
  subject: string;
  message: string;
}

export function MessageParticipantsButton() {
  const params = useParams();
  const eventShortId = params?.id as string;
  const {logEvent} = useTracker();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<Form>();

  const handleOnClick = () => {
    setIsOpen(true);
  };

  const handleOnSubmit = form.handleSubmit(async (data) => {
    if (eventShortId) {
      await api.mail.messageEventParticipants
        .mutate({eventShortId, ...data})
        .then(() => {
          toast.success('Message is sent!', {
            duration: 10000,
          });
          setIsOpen(false);
          form.reset();
          logEvent('event_message_to_attendees_submitted', {
            eventId: eventShortId,
          });
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleOnClick}
          size="sm"
          title="Message attendees"
          data-testid="message-attendees-button"
          className="shrink-0"
        >
          Message attendees
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{'Get in touch with participants'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleOnSubmit}>
            <div className="flex flex-col gap-y-4">
              <div>
                <Input
                  {...form.register('subject')}
                  placeholder="Subject"
                  data-testid="message-attendees-input-subject"
                  autoComplete="off"
                />
              </div>
              <div>
                <Textarea
                  {...form.register('message')}
                  placeholder="Message"
                  data-testid="message-attendees-input-message"
                />
              </div>
              <div className="flex justify-start gap-x-2">
                <Button
                  disabled={form.formState.isSubmitting}
                  isLoading={form.formState.isSubmitting}
                  type="submit"
                  data-testid="message-attendees-form-submit"
                >
                  Send
                </Button>
                <Button
                  onClick={(e) => {
                    setIsOpen(false);
                    form.reset();
                    e.preventDefault();
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
