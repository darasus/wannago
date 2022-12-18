import {Event} from '@prisma/client';
import {isFuture} from 'date-fns';
import Image from 'next/image';
import {formatDate} from '../../../utils/formatDate';
import {Badge} from '../../Badge/Badge';
import {CardBase} from '../CardBase/CardBase';
import {Text} from '../../Text/Text';

interface Props {
  event: Event;
}

export function EventCard({event}: Props) {
  const isUpdcoming = isFuture(event.startDate);

  return (
    <CardBase className="flex flex-col">
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
          />
        </div>
      )}
      <div>
        <div className="flex items-center">
          <Badge color={isUpdcoming ? 'green' : 'gray'} className="mr-2 mb-1">
            {isUpdcoming ? 'Upcoming' : 'Past'}
          </Badge>
          <Text className="text-sm text-gray-600 truncate">
            {formatDate(event.startDate, 'yyyy/MM/dd hh:m')}
          </Text>
        </div>
        <div />
        <Text className="text-2xl font-bold truncate">{event.title}</Text>
      </div>
    </CardBase>
  );
}
