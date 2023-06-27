'use client';

import {useEffect, useMemo, useState} from 'react';
import {formatDate, isSameDay, getRelativeTime} from 'utils';
import {Button, Badge, CardBase, Text} from 'ui';

interface Props {
  onAddToCalendarClick?: () => void;
  startDate: Date;
  endDate: Date;
}

export function DateCard({endDate, startDate, onAddToCalendarClick}: Props) {
  const [isShow, setShow] = useState(false);
  const relativeTime = useMemo(
    () => getRelativeTime(startDate, endDate),
    [startDate, endDate]
  );

  const timeRangeString = getTimeRangeString(startDate, endDate);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 100);
  }, []);

  return (
    <CardBase className="h-full" innerClassName="flex flex-col h-full">
      {isShow && (
        <>
          <div className="mb-2">
            <Badge color="gray" className="mr-2" size="xs">
              When
            </Badge>
            <Button
              onClick={onAddToCalendarClick}
              variant="link-gray"
              size="xs"
            >
              Add to calendar
            </Button>
          </div>
          <Text className="font-bold">{timeRangeString}</Text>
          <div className="mb-2" />
          <div className="flex grow">
            <div className="flex flex-col justify-center items-center border-2 border-gray-800 rounded-2xl min-h-[70px] bg-slate-200 aspect-square h-full mr-2">
              <Text className="text-2xl leading-none font-extrabold">
                {formatDate(new Date(startDate), 'dd')}
              </Text>
              <div />
              <Text className="uppercase text-xs leading-none font-bold">
                {formatDate(new Date(startDate), 'MMM')}
              </Text>
            </div>
            <div className="flex flex-col justify-center grow">
              <Text className="font-bold capitalize">
                {formatDate(new Date(startDate), 'EEE, MMMM dd, yyyy')}
              </Text>{' '}
              <div />
              <Text className="text-gray-500">{relativeTime}</Text>
            </div>
          </div>
        </>
      )}
    </CardBase>
  );
}

function getTimeRangeString(startDate: Date, endDate: Date, timezone?: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const isAtSameDay = isSameDay(start, end, timezone);

  if (isAtSameDay) {
    return `${formatDate(start, 'HH:mm', timezone)} - ${formatDate(
      end,
      'HH:mm',
      timezone
    )}`;
  }

  return `${formatDate(start, 'MMM dd, HH:mm', timezone)} - ${formatDate(
    end,
    'MMM dd, HH:mm',
    timezone
  )}`;
}
