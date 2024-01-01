'use client';

import {saveAs} from 'file-saver';
import {createEvent} from 'ics';
import {Event} from '@prisma/client';
import {prepareIcsData} from 'utils';
import {iOS} from 'utils';
import {Android} from 'utils';
import {useTracker} from 'hooks';
import {useEffect, useMemo, useState} from 'react';
import {formatDate, isSameDay, getRelativeTime} from 'utils';
import {Button, CardBase, Text} from 'ui';

interface Props {
  event: Event;
}

export function DateCard({event}: Props) {
  const {logEvent} = useTracker();
  const handleCalendarClick = () => {
    logEvent('add_to_calendar_button_clicked', {
      eventId: event.id,
    });
    createEvent(prepareIcsData(event), (error, value) => {
      const blob = new Blob([value], {
        type: iOS() || Android() ? 'text/calendar' : 'text/plain;charset=utf-8',
      });
      saveAs(blob, 'event-schedule.ics');
    });
  };

  const [isShow, setShow] = useState(false);
  const relativeTime = useMemo(
    () => getRelativeTime(event.startDate, event.endDate),
    [event.startDate, event.endDate]
  );

  const timeRangeString = getTimeRangeString(event.startDate, event.endDate);

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
          onClick={handleCalendarClick}
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
            <div className="flex flex-col justify-center items-center border bg-muted dark:bg-white/[.04] rounded-md h-24 w-24 mr-2 grow">
              <Text className="text-4xl leading-none font-bold">
                {formatDate(new Date(event.startDate), 'dd')}
              </Text>
              <div />
              <Text className="uppercase text-lg leading-none font-bold">
                {formatDate(new Date(event.startDate), 'MMM')}
              </Text>
            </div>
            <div className="flex flex-col justify-center grow shrink-0">
              <Text className="font-bold capitalize">
                {formatDate(new Date(event.startDate), 'EEE, MMM dd, yyyy')}
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
