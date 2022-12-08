import clsx from 'clsx';
import {CardBase} from '../CardBase/CardBase';
import {Badge} from '../../Badge/Badge';
import {Text} from '../../Text/Text';
import {Event} from '@prisma/client';
import {trpc} from '../../../utils/trpc';
import {Button} from '../../Button/Button';
import Image from 'next/image';
import {useState} from 'react';
import {ContactForm} from './ContactForm';

interface Props {
  event: Event;
}

export function OrganizerCard({event}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {data} = trpc.event.getEventOrganizer.useQuery({
    eventId: event.id,
  });

  const onOpenFormClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <CardBase>
        <div>
          <div className="mb-2">
            <Badge color="indigo" className="mr-2">
              Who
            </Badge>
            <Button onClick={onOpenFormClick} variant="link-neutral">
              Ask a question
            </Button>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="flex h-10 w-10 items-center overflow-hidden relative justify-center  bg-black rounded-full safari-rounded-border-fix">
              {data?.profileImageSrc && (
                <Image
                  src={data?.profileImageSrc}
                  alt=""
                  fill
                  style={{objectFit: 'cover'}}
                  priority
                />
              )}
            </div>
            <Text className="font-bold">{`${data?.firstName} ${data?.lastName}`}</Text>
          </div>
        </div>
      </CardBase>
      <ContactForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        event={event}
      />
    </>
  );
}
