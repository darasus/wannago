'use client';

import {CardBase, Badge, PageHeader} from 'ui';
import {Text} from 'ui';
import {formatTimeago} from 'utils';
import {getBaseUrl} from 'utils';
import React, {use} from 'react';
import {Event} from '@prisma/client';
import {api} from '../../../../../../trpc/client';

interface Props {
  event: Event;
}

export function EventInfo({event}: Props) {
  const attendeesCount = use(
    api.event.getNumberOfAttendees.query({
      eventId: event.id,
    })
  );

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
        typeof attendeesCount?.count === 'number'
          ? event?.maxNumberOfAttendees && event?.maxNumberOfAttendees > 0
            ? `${attendeesCount?.count} of max ${event?.maxNumberOfAttendees}`
            : `${attendeesCount?.count}`
          : 'Loading...',
    },
    {
      label: 'Public url',
      value: publicEventUrl,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Event info" />
      <CardBase>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {values.map((v, i) => {
              return (
                <div key={i} className="flex items-center gap-x-1">
                  <Text className="text-xs">{`${v.label}:`}</Text>
                  <Badge
                    color={v.badgeColor}
                    data-testid={v?.dataTestId}
                    variant={'secondary'}
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
