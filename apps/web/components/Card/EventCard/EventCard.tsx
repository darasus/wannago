import {Event} from '@prisma/client';
import {isFuture} from 'date-fns';
import Image from 'next/image';
import {formatDate} from '../../../utils/formatDate';
import {Badge} from '../../Badge/Badge';
import {CardBase} from '../CardBase/CardBase';
import {Text} from '../../Text/Text';
import {forwardRef} from 'react';

interface Props {
  event: Event;
}

export const EventCard = forwardRef<HTMLDivElement, Props>(function EventCard(
  {event},
  ref
) {
  const isUpcoming = isFuture(event.startDate);

  return (
    <CardBase ref={ref} className="flex flex-col">
      {event.featuredImageSrc && (
        <div className="grow overflow-hidden relative justify-center bg-black rounded-3xl aspect-video safari-rounded-border-fix mb-4">
          <div className="absolute left-4 top-4 z-10">
            {event.isPublished ? (
              <Badge color="green">Published</Badge>
            ) : (
              <Badge color="gray">Draft</Badge>
            )}
          </div>
          <Image
            src={event.featuredImageSrc}
            alt=""
            fill
            style={{objectFit: 'cover'}}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div>
        <div className="flex items-center">
          <Badge color={isUpcoming ? 'green' : 'gray'} className="mr-2 mb-1">
            {isUpcoming ? 'Upcoming' : 'Past'}
          </Badge>
          <Text className="text-sm text-gray-600 truncate">
            {formatDate(event.startDate, 'yyyy/MM/dd HH:mm')}
          </Text>
        </div>
        <div />
        <Text className="text-2xl font-bold truncate">{event.title}</Text>
      </div>
    </CardBase>
  );
});
