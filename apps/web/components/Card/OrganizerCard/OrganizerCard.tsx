import {Event, User} from '@prisma/client';
import {useState} from 'react';
import {ContactForm} from './ContactForm';
import {trpc} from '../../../utils/trpc';
import {OrganizerCardView} from './OrganizerCardView';

interface Props {
  event: Event;
  fake?: boolean;
  fakeUser?: Partial<User>;
}

export function OrganizerCard({event}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {data, isLoading} = trpc.event.getOrganizer.useQuery({
    eventId: event.id,
  });

  const onOpenFormClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <OrganizerCardView
        isLoading={isLoading}
        user={data || null}
        onOpenFormClick={onOpenFormClick}
      />
      <ContactForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        event={event}
      />
    </>
  );
}
