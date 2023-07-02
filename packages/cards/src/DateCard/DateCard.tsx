'use client';

import {useEffect, useMemo, useState} from 'react';
import {formatDate, isSameDay, getRelativeTime} from 'utils';
import {Button, CardBase, Text} from 'ui';

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
    <CardBase
      className="h-full"
      innerClassName="flex flex-col h-full"
      title={'When'}
      titleChildren={
        <Button
          onClick={onAddToCalendarClick}
          variant="link"
          size="sm"
          className="p-0 h-auto"
        >
          Add to calendar
        </Button>
      }
    >
      {isShow && (
        <>
          <Text className="font-bold">{timeRangeString}</Text>
          <div className="mb-2" />
          <div className="flex">
            <div className="flex flex-col justify-center items-center border-2 border-foreground rounded-md bg-muted h-24 w-24 mr-2 grow">
              <Text className="text-4xl leading-none font-bold">
                {formatDate(new Date(startDate), 'dd')}
              </Text>
              <div />
              <Text className="uppercase text-lg leading-none font-bold">
                {formatDate(new Date(startDate), 'MMM')}
              </Text>
            </div>
            <div className="flex flex-col justify-center grow shrink-0">
              <Text className="font-bold capitalize">
                {formatDate(new Date(startDate), 'EEE, MMMM dd, yyyy')}
              </Text>{' '}
              <div />
              <Text className="text-secondary-foreground/50">
                {relativeTime}
              </Text>
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
