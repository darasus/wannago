import {Event} from '@prisma/client';
import {useState} from 'react';
import {ContactFormModal} from '../../components/ContactFormModal/ContactFormModal';
import {trpc} from '../../utils/trpc';
import {OrganizerCard as OrganizerCardView} from '../../components/OrganizerCard/OrganizerCard';
import {useAmplitude} from '../../hooks/useAmplitude';
import {FormProvider, useForm} from 'react-hook-form';
import {ContactForm} from '../../types/forms';
import {toast} from 'react-hot-toast';

interface Props {
  event: Event;
}

export function OrganizerCard({event}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {data, isLoading} = trpc.event.getOrganizer.useQuery({
    eventId: event.id,
  });

  const onOpenFormClick = () => {
    setIsOpen(true);
  };

  const {logEvent} = useAmplitude();
  const sendEmail = trpc.mail.sendQuestionToOrganizer.useMutation();
  const form = useForm<ContactForm>();

  const onSubmit = form.handleSubmit(async data => {
    logEvent('event_message_to_organizer_submitted', {
      eventId: event.id,
    });
    await sendEmail.mutateAsync({...data, eventId: event.id});
    toast.success('Email sent! Organizer will get back to you soon!');
    setIsOpen(false);
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
