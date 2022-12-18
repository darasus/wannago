import clsx from 'clsx';
import {CardBase} from '../CardBase/CardBase';
import {Badge} from '../../Badge/Badge';
import {Text} from '../../Text/Text';
import {Event} from '@prisma/client';
import {Button} from '../../Button/Button';
import Image from 'next/image';
import {useState} from 'react';
import {ContactForm} from './ContactForm';
import {Spinner} from '../../Spinner/Spinner';
import {trpc} from '../../../utils/trpc';

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

  const name = data ? `${data?.firstName} ${data?.lastName}` : 'Loading...';

  return (
    <>
      <CardBase>
        <div>
          <div className="mb-2">
            <Badge color="gray" className="mr-2">
              Who
            </Badge>
            <Button onClick={onOpenFormClick} variant="link-neutral">
              Message organizer
            </Button>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="flex h-10 w-10 items-center overflow-hidden relative justify-center rounded-full safari-rounded-border-fix">
              {isLoading && (
                <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-full border border-gray-200">
                  <Spinner className="text-gray-400" />
                </div>
              )}
              {data?.profileImageSrc ? (
                <Image
                  src={data?.profileImageSrc}
                  alt=""
                  fill
                  style={{objectFit: 'cover'}}
                  priority
                />
              ) : (
                <Image
                  src={
                    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                  }
                  alt=""
                  fill
                  style={{objectFit: 'cover'}}
                  priority
                />
              )}
            </div>
            <Text className="font-bold">{name}</Text>
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
