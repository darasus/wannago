import clsx from 'clsx';
import {CardBase} from '../CardBase/CardBase';
import {Badge} from '../../Badge/Badge';
import {Text} from '../../Text/Text';
import {Event, User} from '@prisma/client';
import {Button} from '../../Button/Button';
import Image from 'next/image';
import {useState} from 'react';
import {ContactForm} from './ContactForm';
import {Spinner} from '../../Spinner/Spinner';
import {trpc} from '../../../utils/trpc';
import {OrganizerCardView} from './OrganizerCardView';

interface Props {
  event: Event;
  fake?: boolean;
  fakeUser?: Partial<User>;
}

export function OrganizerCard({event, fake}: Props) {
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
