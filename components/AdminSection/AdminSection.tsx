import {
  PencilIcon,
  TrashIcon,
  UsersIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from '@heroicons/react/24/solid';
import {Event} from '@prisma/client';
import {useRouter} from 'next/router';
import {toast} from 'react-hot-toast';
import {formatDate} from '../../utils/formatDate';
import {trpc} from '../../utils/trpc';
import {Badge} from '../Badge/Badge';
import {Button} from '../Button/Button';
import {CardBase} from '../Card/CardBase/CardBase';
import {Text} from '../Text/Text';
import {MessageParticipantsButton} from './components/MessageParticipantsButton';

interface Props {
  event: Event;
  timezone?: string | null;
  refetchEvent: () => void;
}

export function AdminSection({event, timezone, refetchEvent}: Props) {
  const router = useRouter();
  const remove = trpc.event.remove.useMutation({
    onSuccess: () => router.push('/dashboard'),
  });
  const publish = trpc.event.publish.useMutation({
    onSuccess: () => {
      refetchEvent();
      toast.success(`Event is updated!`);
    },
  });
  const attendeesCount = trpc.event.getNumberOfAttendees.useQuery({
    eventId: event.id,
  });

  return (
    <CardBase>
      <div className="flex items-center">
        <Badge color="gray" className="mr-2 mb-1">
          Admin
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div>
            <Text className="font-bold">Event info</Text>
          </div>
          <div className="flex flex-col gap-2">
            <Text>
              Status:{' '}
              {event.isPublished ? (
                <Badge color="green">Published</Badge>
              ) : (
                <Badge color="gray">Draft</Badge>
              )}
            </Text>
            <Text>{`Created at: ${formatDate(
              event.createdAt,
              'yyyy/MM/dd HH:mm',
              timezone
            )}`}</Text>
            <Text>{`Last updated at: ${formatDate(
              event.updatedAt,
              'yyyy/MM/dd HH:mm',
              timezone
            )}`}</Text>
            <Text>{`Number of attendees: ${
              typeof attendeesCount.data?.count === 'number'
                ? attendeesCount.data?.count
                : 'Loading...'
            }`}</Text>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <Text className="font-bold">Manage event</Text>
          </div>
          <div className="flex flex-col items-start gap-2">
            <Button
              variant="neutral"
              iconLeft={<UsersIcon className="h-5 w-5" />}
              onClick={() => router.push(`/event/${event.id}/attendees`)}
            >
              View attendees
            </Button>
            <Button
              variant="neutral"
              iconLeft={<PencilIcon className="h-5 w-5" />}
              onClick={() => router.push(`/event/${event.id}/edit`)}
            >
              Edit event
            </Button>
            <MessageParticipantsButton />
            {event.isPublished && (
              <Button
                variant="danger"
                iconLeft={<PauseCircleIcon className="h-5 w-5" />}
                onClick={() =>
                  publish.mutate({eventId: event.id, isPublished: false})
                }
                isLoading={publish.isLoading}
              >
                Unpublish
              </Button>
            )}
            {!event.isPublished && (
              <Button
                variant="primary"
                iconLeft={<PlayCircleIcon className="h-5 w-5" />}
                onClick={() =>
                  publish.mutate({eventId: event.id, isPublished: true})
                }
                isLoading={publish.isLoading}
              >
                Publish
              </Button>
            )}
            <Button
              variant="danger"
              iconLeft={<TrashIcon className="h-5 w-5" />}
              onClick={() => remove.mutate({eventId: event.id})}
              isLoading={remove.isLoading}
            >
              Delete event
            </Button>
          </div>
        </div>
      </div>
    </CardBase>
  );
}
