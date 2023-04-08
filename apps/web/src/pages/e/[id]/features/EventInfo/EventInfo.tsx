import {CardBase, Badge} from 'ui';
import {Text, Tooltip} from 'ui';
import {formatTimeago} from 'utils';
import {useAttendeeCount, useEventId, useEventQuery} from 'hooks';
import {getBaseUrl} from 'utils';
import React from 'react';
import {cn} from 'utils';

export function EventInfo() {
  const {eventShortId} = useEventId();
  const {data: event} = useEventQuery({eventShortId});
  const attendeesCount = useAttendeeCount({eventId: event?.id});

  const publicEventUrl = event?.isPublished
    ? `${getBaseUrl()}/e/${event?.shortId}`
        .replace('https://www.', '')
        .replace('http://', '')
    : `${getBaseUrl()}/e/abcdef`
        .replace('https://www.', '')
        .replace('http://', '');

  const values: {
    label: string;
    value: JSX.Element | string;
    badgeColor?: 'green' | 'yellow';
    dataTestId?: string;
  }[] = [
    {
      label: 'Status',
      value: event?.isPublished ? 'Published' : 'Draft',
      badgeColor: event?.isPublished ? 'green' : 'yellow',
      dataTestId: 'event-status-label',
    },
    {
      label: 'Created',
      value: event?.createdAt ? formatTimeago(event?.createdAt) : '',
    },
    {
      label: 'Updated',
      value: event?.updatedAt ? formatTimeago(event?.updatedAt) : '',
    },
    {
      label: 'Attendees',
      value:
        typeof attendeesCount.data?.count === 'number'
          ? event?.maxNumberOfAttendees && event?.maxNumberOfAttendees > 0
            ? `${attendeesCount.data?.count} of max ${event?.maxNumberOfAttendees}`
            : `${attendeesCount.data?.count}`
          : 'Loading...',
    },
    {
      label: 'Public url',
      value: (
        <Tooltip
          text={
            event?.isPublished
              ? undefined
              : 'To see the public link, please publish the event first.'
          }
        >
          <span className={cn({'blur-[3px]': !event?.isPublished})}>
            {publicEventUrl}
          </span>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <CardBase>
        <div className="flex items-center">
          <Badge color="gray" className="mr-2 mb-2" size="xs">
            Info
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {values.map((v, i) => {
              return (
                <div key={i} className="flex items-center gap-x-1">
                  <Text className="text-xs">{`${v.label}:`}</Text>
                  <Badge
                    color={v.badgeColor}
                    size="xs"
                    data-testid={v?.dataTestId}
                  >
                    {v.value}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </CardBase>
    </div>
  );
}
