'use client';

import {format} from 'date-fns';
import {format as timeagoFormat} from 'timeago.js';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {SectionTitle} from '../Text/SectionTitle';
import {Text} from '../Text/Text';
import {ics} from 'calendar-link';
import {useRouter} from 'next/router';
import {Event} from '@prisma/client';
import {getBaseUrl} from '../../lib/api';

interface Props {
  event: Event;
}

export function DateCard({event}: Props) {
  const router = useRouter();

  const icsData = {
    title: event.title,
    description: event.description,
    start: `${format(event.startDate, 'yyyy-MM-dd')} 18:00:00 +0100`,
    end: `${format(event.endDate, 'yyyy-MM-dd')} 18:00:00 +0100`,
    location: event.address,
    url: `${getBaseUrl()}/e/${event.shortId}`,
  };

  console.log(icsData);

  const handleCalendarClick = () => {
    router.push(ics(icsData));
  };

  return (
    <Card>
      <div className="mb-2">
        <SectionTitle color="yellow" className="mr-2">
          When
        </SectionTitle>
        <Button onClick={handleCalendarClick} variant="link-neutral">
          Add to calendar
        </Button>
      </div>
      <div className="flex">
        <div className="mr-2">
          <div className="flex flex-col justify-center items-center border rounded-xl px-4 py-2  shadow-md">
            <div className="h-0.5 bg-red-500 w-5 mb-1" />
            <Text className="text-2xl leading-none">
              {format(event.startDate, 'dd')}
            </Text>
            <div />
            <Text className="uppercase text-xs leading-none text-gray-500">
              {format(event.startDate, 'LLL')}
            </Text>
          </div>
        </div>
        <div className="grow">
          <Text className="font-bold capitalize">
            {format(event.startDate, 'EEEE, MMMM dd')}
          </Text>{' '}
          <Text className="text-gray-500">{`(${timeagoFormat(
            event.startDate,
            'en_US'
          )})`}</Text>
          <div />
          <Text>{`${format(event.startDate, 'k:mm')} - ${format(
            event.endDate,
            'k:mm'
          )}`}</Text>
        </div>
      </div>
    </Card>
  );
}
