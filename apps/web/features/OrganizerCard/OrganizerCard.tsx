import {Event, User} from '@prisma/client';
import {useState} from 'react';
import {ContactFormModal} from '../../components/ContactFormModal/ContactFormModal';
import {trpc} from 'trpc/src/trpc';
import {OrganizerCard as OrganizerCardView} from 'cards';
import {useAmplitude} from '../../hooks/useAmplitude';
import {FormProvider, useForm} from 'react-hook-form';
import {ContactForm} from '../../types/forms';
import {toast} from 'react-hot-toast';

interface Props {
  event: Event & {organization?: {users?: User[]}};
}

export function OrganizerCard({event}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {data, isLoading} = trpc.event.getOrganizer.useQuery(
    {
      eventId: event.id,
    },
    {
      initialData: event.organization?.users?.[0],
    }
  );

  const onOpenFormClick = () => {
    setIsOpen(true);
  };

  const {logEvent} = useAmplitude();
  const sendEmail = trpc.mail.sendQuestionToOrganizer.useMutation();
  const form = useForm<ContactForm>();

  const onSubmit = form.handleSubmit(async data => {
    await sendEmail.mutateAsync({...data, eventId: event.id});
    toast.success('Email sent! Organizer will get back to you soon!', {
      duration: 10000,
    });
    setIsOpen(false);
    logEvent('event_message_to_organizer_submitted', {
      eventId: event.id,
    });
  });

  return (
    <>
      <OrganizerCardView
        isLoading={isLoading}
        user={data || null}
        onOpenFormClick={onOpenFormClick}
      />
      <FormProvider {...form}>
        <ContactFormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={onSubmit}
        />
      </FormProvider>
    </>
  );
}
