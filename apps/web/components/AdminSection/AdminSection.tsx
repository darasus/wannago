import {
  PencilIcon,
  TrashIcon,
  UsersIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from '@heroicons/react/24/solid';
import {useRouter} from 'next/router';
import {Badge} from '../Badge/Badge';
import {Button} from '../Button/Button';
import {CardBase} from '../Card/CardBase/CardBase';
import {Text} from '../Text/Text';
import {MessageParticipantsButton} from './components/MessageParticipantsButton';
import {Event} from '@prisma/client';
import {formatTimeago} from '../../utils/formatDate';
import {useAttendeeCount} from '../../hooks/useAttendeeCount';
import {useRemoveEvent} from '../../hooks/useRemoveEvent';
import {usePublishEvent} from '../../hooks/usePublishEvent';
import {useUnpublishEvent} from '../../hooks/useUnpublishEvent';

interface Props {
  event: Event;
  timezone?: string | null;
  refetchEvent: () => void;
}

export function AdminSection({event, timezone}: Props) {
  const router = useRouter();
  const attendeesCount = useAttendeeCount(event.id);
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
  ];

  return (
    <>
      {removeEventModal}
      {publishModal}
      {unpublishModal}
      <CardBase>
        <div className="flex items-center">
          <Badge color="gray" className="mr-2 mb-2">
            Admin
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            {values.map(v => {
              return (
                <div className="flex items-center gap-x-1">
                  <Text className="text-xs">{`${v.label}:`}</Text>
                  <Badge color={v.badgeColor} size="sm">
                    {v.value}
                  </Badge>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <Button
              variant="neutral"
              iconLeft={<PencilIcon className="h-3 w-3" />}
              onClick={() => router.push(`/event/${event.id}/edit`)}
              size="sm"
            >
              Edit event
            </Button>
            {event.isPublished && (
              <Button
                variant="danger"
                iconLeft={<PauseCircleIcon className="h-3 w-3" />}
                onClick={() => onUnpublishClick()}
                size="sm"
              >
                Unpublish
              </Button>
            )}
            {!event.isPublished && (
              <Button
                variant="primary"
                iconLeft={<PlayCircleIcon className="h-3 w-3" />}
                onClick={() => onPublishClick()}
                size="sm"
              >
                Publish
              </Button>
            )}
            <Button
              variant="danger"
              iconLeft={<TrashIcon className="h-3 w-3" />}
              onClick={onRemoveClick}
              size="sm"
            >
              Delete event
            </Button>
            <Button
              variant="neutral"
              iconLeft={<UsersIcon className="h-3 w-3" />}
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
