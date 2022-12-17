import {EventAttributes} from 'ics';
import {format} from 'date-fns';
import {Event} from '@prisma/client';
import {getBaseUrl} from './getBaseUrl';

export function prepareIcsData(event: Event): EventAttributes {
  const icsData: EventAttributes = {
    title: event.title,
    description: event.description,
    start: [
      Number(format(event.startDate, 'yyyy')),
      Number(format(event.startDate, 'M')),
      Number(format(event.startDate, 'd')),
      Number(format(event.startDate, 'K')),
      Number(format(event.startDate, 'm')),
    ],
    end: [
      Number(format(event.endDate, 'yyyy')),
      Number(format(event.endDate, 'M')),
      Number(format(event.endDate, 'd')),
      Number(format(event.endDate, 'K')),
      Number(format(event.endDate, 'm')),
    ],
    location: event.address,
    url: `${getBaseUrl()}/e/${event.shortId}`,
  };

  return icsData;
}
