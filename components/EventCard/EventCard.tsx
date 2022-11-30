import {Event} from '@prisma/client';
import {isFuture} from 'date-fns';
import Image from 'next/image';
import {formatDate} from '../../utils/formatDate';
import {Badge} from '../Badge/Badge';
import {Card} from '../Card/Card';
import {Text} from '../Text/Text';

interface Props {
  event: Event;
}

export function EventCard({event}: Props) {
  const isUpdcoming = isFuture(event.startDate);

  return (
    <Card className="flex flex-col p-0">
      {event.featuredImageSrc && (
        <div className="grow overflow-hidden relative justify-center bg-black rounded-t-xl aspect-video">
          <Image
            src={event.featuredImageSrc}
            alt=""
            fill
            style={{objectFit: 'cover'}}
            priority
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center">
          <Badge color={isUpdcoming ? 'green' : 'gray'} className="mr-2 mb-1">
            {isUpdcoming ? 'Upcoming' : 'Past'}
          </Badge>
          <Text className="text-sm text-gray-600">
            {formatDate(event.startDate, 'yyyy/MM/dd hh:m')}
          </Text>
        </div>
        <div />
        <Text className="text-lg font-bold">{event.title}</Text>
      </div>
    </Card>
  );
}
