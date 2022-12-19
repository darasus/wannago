import {Button} from '../../Button/Button';
import {CardBase} from '../CardBase/CardBase';
import {Badge} from '../../Badge/Badge';
import {Text} from '../../Text/Text';
import {saveAs} from 'file-saver';
import {createEvent} from 'ics';
import {Event} from '@prisma/client';
import {formatDate, formatTimeago} from '../../../utils/formatDate';
import {prepareIcsData} from '../../../utils/prepareIcsData';

interface Props {
  event: Event;
  timezone?: string;
}

export function DateCard({event, timezone}: Props) {
  const handleCalendarClick = () => {
    createEvent(prepareIcsData(event), (error, value) => {
      const blob = new Blob([value], {type: 'text/plain;charset=utf-8'});
      saveAs(blob, 'event-schedule.ics');
    });
  };

  return (
    <CardBase>
      <div className="mb-2">
        <Badge color="gray" className="mr-2">
          When
        </Badge>
        <Button onClick={handleCalendarClick} variant="link-neutral">
          Add to calendar
        </Button>
      </div>
      <div className="flex">
        <div className="mr-2">
          <div className="flex flex-col justify-center items-center border-2 border-gray-700 rounded-2xl px-4 py-2 bg-brand-400">
            <div className="h-0.5 bg-red-500 w-5 mb-1" />
            <Text className="text-2xl leading-none">
              {formatDate(new Date(event.startDate), 'dd', timezone)}
            </Text>
            <div />
            <Text className="uppercase text-xs leading-none text-gray-500">
              {formatDate(new Date(event.startDate), 'MMM', timezone)}
            </Text>
          </div>
        </div>
        <div className="grow">
          <Text className="font-bold capitalize">
            {formatDate(new Date(event.startDate), 'EEE, MMMM dd', timezone)}
          </Text>{' '}
          <Text className="text-gray-500">{`(${formatTimeago(
            new Date(event.startDate),
            timezone
          )})`}</Text>
          <div />
          <Text>{`${formatDate(
            new Date(event.startDate),
            'HH:mm',
            timezone
          )} - ${formatDate(
            new Date(event.endDate),
            'HH:mm',
            timezone
          )}`}</Text>
        </div>
      </div>
    </CardBase>
  );
}