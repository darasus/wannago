import {Event} from '@prisma/client';
import {useState} from 'react';
import {ContactFormModal} from '../../components/ContactFormModal/ContactFormModal';
import {trpc} from 'trpc/src/trpc';
import {OrganizerCard as OrganizerCardView} from 'cards';
import {useAmplitude} from 'hooks';
import {FormProvider, useForm} from 'react-hook-form';
import {ContactForm} from '../../types/forms';
import {toast} from 'react-hot-toast';

interface Props {
  event: Event;
}

export function OrganizerCard({event}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {logEvent} = useAmplitude();
  const sendEmail = trpc.mail.sendQuestionToOrganizer.useMutation();
  const form = useForm<ContactForm>();
  const organizer = trpc.event.getOrganizer.useQuery({
    eventShortId: event.shortId,
  });

  const onOpenFormClick = () => {
    setIsOpen(true);
  };

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
        name={organizer.data?.name || 'Loading...'}
        profileImageSrc={organizer.data?.profileImageSrc}
        profilePath={organizer.data?.profilePath || ''}
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
