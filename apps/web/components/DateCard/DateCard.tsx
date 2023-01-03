import {isSameDay} from 'date-fns';
import {formatDate, formatTimeago} from '../../utils/formatDate';
import {Badge} from '../Badge/Badge';
import {Button} from '../Button/Button';
import {CardBase} from '../CardBase/CardBase';
import {Text} from '../Text/Text';

interface Props {
  onAddToCalendarClick: () => void;
  startDate: Date;
  endDate: Date;
  timezone?: string;
}

export function DateCard({
  endDate,
  startDate,
  timezone,
  onAddToCalendarClick,
}: Props) {
  const isAtSameDay = isSameDay(new Date(startDate), new Date(endDate));

  return (
    <CardBase>
      <div className="mb-2">
        <Badge color="gray" className="mr-2">
          When
        </Badge>
        <Button onClick={onAddToCalendarClick} variant="link-neutral">
          Add to calendar
        </Button>
      </div>
      <div className="flex">
        <div className="mr-2">
          <div className="flex flex-col justify-center items-center border-2 border-slate-800 rounded-2xl px-4 py-2 bg-brand-400">
            <div className="h-0.5 bg-red-500 w-5 mb-1" />
            <Text className="text-2xl leading-none">
              {formatDate(new Date(startDate), 'dd', timezone)}
            </Text>
            <div />
            <Text className="uppercase text-xs leading-none text-gray-500">
              {formatDate(new Date(startDate), 'MMM', timezone)}
            </Text>
          </div>
        </div>
        <div className="grow">
          <Text className="font-bold capitalize">
            {formatDate(new Date(startDate), 'EEE, MMMM dd', timezone)}
          </Text>{' '}
          <Text className="text-gray-500">{`(${formatTimeago(
            new Date(startDate),
            timezone
          )})`}</Text>
          <div />
          {isAtSameDay ? (
            <Text>{`${formatDate(
              new Date(startDate),
              'HH:mm',
              timezone
            )} - ${formatDate(new Date(endDate), 'HH:mm', timezone)}`}</Text>
          ) : (
            <Text className="text-sm">{`${formatDate(
              new Date(startDate),
              'MMM dd, HH:mm',
              timezone
            )} - ${formatDate(
              new Date(endDate),
              'MMM dd, HH:mm',
              timezone
            )}`}</Text>
          )}
        </div>
      </div>
    </CardBase>
  );
}
