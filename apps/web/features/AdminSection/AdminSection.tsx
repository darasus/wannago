import {
  PencilIcon,
  TrashIcon,
  UsersIcon,
  PlayCircleIcon,
  PauseCircleIcon,
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

  const values: {
    label: string;
    value: string;
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
      value: `${getBaseUrl()}/e/${event.shortId}`
        .replace('https://www.', '')
        .replace('http://', ''),
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
            <Button
              variant="neutral"
              iconLeft={<PencilIcon />}
              onClick={() => router.push(`/event/${event.id}/edit`)}
              size="sm"
            >
              Edit event
            </Button>
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
              View attendees
            </Button>
            <MessageParticipantsButton />
          </div>
        </div>
      </CardBase>
    </>
  );
}
