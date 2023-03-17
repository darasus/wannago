import {
  PencilIcon,
  TrashIcon,
  UsersIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from '@heroicons/react/24/solid';
import {useRouter} from 'next/router';
import {Button, CardBase, Badge} from 'ui';
import {Text, Tooltip} from 'ui';
import {Event} from '@prisma/client';
import {formatTimeago} from 'utils';
import {useAttendeeCount} from 'hooks';
import {useRemoveEvent} from 'hooks';
import {usePublishEvent} from 'hooks';
import {useUnpublishEvent} from 'hooks';
import {getBaseUrl} from 'utils';
import React from 'react';
import {cn} from 'utils';

interface Props {
  event: Event;
  refetchEvent: () => void;
}

export function AdminSection({event}: Props) {
  const router = useRouter();
  const attendeesCount = useAttendeeCount({eventId: event.id});
  const {modal: removeEventModal, onRemoveClick} = useRemoveEvent({
    eventId: event.id,
  });
  const {modal: publishModal, onPublishClick} = usePublishEvent({
    eventId: event.id,
  });
  const {modal: unpublishModal, onUnpublishClick} = useUnpublishEvent({
    eventId: event.id,
  });

  const publicEventUrl = event.isPublished
    ? `${getBaseUrl()}/e/${event.shortId}`
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
      value: event.isPublished ? 'Published' : 'Draft',
      badgeColor: event.isPublished ? 'green' : 'yellow',
      dataTestId: 'event-status-label',
    },
    {
      label: 'Created',
      value: formatTimeago(event.createdAt),
    },
    {
      label: 'Updated',
      value: formatTimeago(event.updatedAt),
    },
    {
      label: 'Attendees',
      value:
        typeof attendeesCount.data?.count === 'number'
          ? event.maxNumberOfAttendees > 0
            ? `${attendeesCount.data?.count} of max ${event.maxNumberOfAttendees}`
            : `${attendeesCount.data?.count}`
          : 'Loading...',
    },
    {
      label: 'Public url',
      value: (
        <Tooltip
          text={
            event.isPublished
              ? undefined
              : 'To see the public link, please publish the event first.'
          }
        >
          <span className={cn({'blur-[3px]': !event.isPublished})}>
            {publicEventUrl}
          </span>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      {removeEventModal}
      {publishModal}
      {unpublishModal}
      <CardBase>
        <div className="flex items-center">
          <Badge color="gray" className="mr-2 mb-2" size="xs">
            Admin
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
          <div className="flex flex-col gap-2 items-start">
            <Button
              variant="neutral"
              iconLeft={<PencilIcon />}
              onClick={() => router.push(`/e/${event.shortId}/edit`)}
              size="sm"
              data-testid="edit-event-button"
            >
              Edit
            </Button>
            <Button
              variant="neutral"
              iconLeft={<UsersIcon />}
              onClick={() => router.push(`/e/${event.shortId}/attendees`)}
              size="sm"
              data-testid="event-attendees-button"
            >
              Attendees
            </Button>
            {event.isPublished && (
              <Button
                variant="danger"
                iconLeft={<PauseCircleIcon />}
                onClick={() => onUnpublishClick()}
                size="sm"
                data-testid="unpublish-event-button"
              >
                Unpublish
              </Button>
            )}
            {!event.isPublished && (
              <Button
                variant="success"
                iconLeft={<PlayCircleIcon />}
                onClick={() => onPublishClick()}
                size="sm"
                data-testid="publish-event-button"
              >
                Publish
              </Button>
            )}
            <Button
              variant="danger"
              iconLeft={<TrashIcon />}
              onClick={onRemoveClick}
              size="sm"
              data-testid="delete-event-button"
            >
              Delete event
            </Button>
          </div>
        </div>
      </CardBase>
    </>
  );
}
