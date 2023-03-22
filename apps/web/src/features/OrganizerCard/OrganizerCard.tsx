import {Event, Organization, User} from '@prisma/client';
import {useCallback, useState} from 'react';
import {ContactFormModal} from '../../components/ContactFormModal/ContactFormModal';
import {trpc} from 'trpc/src/trpc';
import {OrganizerCard as OrganizerCardView} from 'cards';
import {useAmplitude} from 'hooks';
import {FormProvider, useForm} from 'react-hook-form';
import {ContactForm} from '../../types/forms';
import {toast} from 'react-hot-toast';
import invariant from 'invariant';

interface Props {
  event: Event & {organization?: Organization & {users?: User[]}; user?: User};
}

export function OrganizerCard({event}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {logEvent} = useAmplitude();
  const sendEmail = trpc.mail.sendQuestionToOrganizer.useMutation();
  const form = useForm<ContactForm>();

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

  const getOrganizerInfo = useCallback(() => {
    if (event.organization?.isActive) {
      invariant(event.organization.name, 'Organization is required');
      invariant(event.organization?.logoSrc, 'Organization is required');
      invariant(event.organization.logoSrc, 'Profile picture is required');
      return {
        name: event.organization.name,
        profileImageSrc: event.organization.logoSrc,
        profilePath: `/o/${event.organization.id}`,
      };
    }

    if (event.user) {
      invariant(event.user.profileImageSrc, 'Profile picture is required');
      return {
        name: `${event.user.firstName} ${event.user.lastName}`,
        profileImageSrc: event.user.profileImageSrc,
        profilePath: `/u/${event.user.id}`,
      };
    }

    if (event.organization?.users?.[0]) {
      const user = event.organization.users[0];
      invariant(user.profileImageSrc, 'Profile picture is required');
      return {
        name: `${user.firstName} ${user.lastName}`,
        profileImageSrc: user.profileImageSrc,
        profilePath: `/u/${user.id}`,
      };
    }

    return {name: '', profileImageSrc: '', profilePath: ''};
  }, [event]);

  const {name, profileImageSrc, profilePath} = getOrganizerInfo();

  return (
    <>
      <OrganizerCardView
        name={name}
        profileImageSrc={profileImageSrc}
        profilePath={profilePath}
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
