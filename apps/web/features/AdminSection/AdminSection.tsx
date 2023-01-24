import {
  PencilIcon,
  TrashIcon,
  UsersIcon,
  PlayCircleIcon,
  PauseCircleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/solid';
import {useRouter} from 'next/router';
import {Badge} from '../../components/Badge/Badge';
import {Button} from '../../components/Button/Button';
import {CardBase} from '../../components/CardBase/CardBase';
import {Text} from '../../components/Text/Text';
import {MessageParticipantsButton} from '../MessageParticipantsButton/MessageParticipantsButton';
import {Event} from '@prisma/client';
import {formatTimeago} from '../../utils/formatDate';
import {useAttendeeCount} from '../../hooks/useAttendeeCount';
import {useRemoveEvent} from '../../hooks/useRemoveEvent';
import {usePublishEvent} from '../../hooks/usePublishEvent';
import {useUnpublishEvent} from '../../hooks/useUnpublishEvent';
import {getBaseUrl} from '../../utils/getBaseUrl';
import {Tooltip} from '../../components/Tooltip/Tooltip';
import React from 'react';
import {cn} from '../../utils/cn';

interface Props {
  event: Event;
  timezone?: string | null;
  refetchEvent: () => void;
}

export function AdminSection({event, timezone}: Props) {
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
    : `${getBaseUrl()}/e/abcdef`;

  const values: {
    label: string;
    value: JSX.Element | string;
    badgeColor?: 'green' | 'yellow';
  }[] = [
    {
      label: 'Status',
      value: event.isPublished ? 'Published' : 'Draft',
      badgeColor: event.isPublished ? 'green' : 'yellow',
    },
    {
      label: 'Created',
      value: formatTimeago(event.createdAt, timezone),
    },
    {
      label: 'Updated',
      value: formatTimeago(event.updatedAt, timezone),
    },
    {
      label: 'Attendees',
      value:
        typeof attendeesCount.data?.count === 'number'
          ? `${attendeesCount.data?.count} of max ${event.maxNumberOfAttendees}`
          : 'Loading...',
    },
    {
      label: 'Public url',
      value: (
        <Tooltip
          text={
            event.isPublished
              ? undefined
              : 'To see public link please publish event first'
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
                  <Badge color={v.badgeColor} size="xs">
                    {v.value}
                  </Badge>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 items-start">
            {event.isPublished && (
              <Button
                variant="danger"
                iconLeft={<PauseCircleIcon />}
                onClick={() => onUnpublishClick()}
                size="sm"
              >
                Unpublish
              </Button>
            )}
            {!event.isPublished && (
              <Button
                variant="primary"
                iconLeft={<PlayCircleIcon />}
                onClick={() => onPublishClick()}
                size="sm"
              >
                Publish
              </Button>
            )}
            <Button
              variant="neutral"
              iconLeft={<PencilIcon />}
              onClick={() => router.push(`/event/${event.id}/edit`)}
              size="sm"
            >
              Edit event
            </Button>
            <Button
              variant="danger"
              iconLeft={<TrashIcon />}
              onClick={onRemoveClick}
              size="sm"
            >
              Delete event
            </Button>
            <Button
              variant="neutral"
              iconLeft={<UsersIcon />}
              onClick={() => router.push(`/event/${event.id}/attendees`)}
              size="sm"
            >
              Attendees
            </Button>
            <MessageParticipantsButton />
          </div>
        </div>
      </CardBase>
    </>
  );
}
