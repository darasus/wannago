import {PencilIcon, TrashIcon, UsersIcon} from '@heroicons/react/24/solid';
import {Event} from '@prisma/client';
import {useRouter} from 'next/router';
import {formatDate} from '../../utils/formatDate';
import {trpc} from '../../utils/trpc';
import {Badge} from '../Badge/Badge';
import {Button} from '../Button/Button';
import {CardBase} from '../Card/CardBase/CardBase';
import {Text} from '../Text/Text';

interface Props {
  event: Event;
  timezone?: string | null;
}

export function AdminSection({event, timezone}: Props) {
  const router = useRouter();
  const {mutate, isLoading} = trpc.event.remove.useMutation({
    onSuccess: () => router.push('/dashboard'),
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
              'yyyy/MM/dd hh:m',
              timezone
            )}`}</Text>
            <Text>{`Last updated at: ${formatDate(
              event.updatedAt,
              'yyyy/MM/dd hh:m',
              timezone
            )}`}</Text>
            <Text>{`Number of attendees: ${123}`}</Text>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <Text className="font-bold">Manage event</Text>
          </div>
          <div className="flex flex-col items-start gap-2">
            <Button
              variant="neutral"
              iconLeft={<UsersIcon className="h-5 w-5" aria-hidden="true" />}
              onClick={() => router.push(`/event/${event.id}/attendees`)}
            >
              View attendees
            </Button>
            <Button
              variant="neutral"
              iconLeft={<PencilIcon className="h-5 w-5" aria-hidden="true" />}
              onClick={() => router.push(`/event/${event.id}/edit`)}
            >
              Edit event
            </Button>
            <Button
              variant="danger"
              iconLeft={<TrashIcon className="h-5 w-5" aria-hidden="true" />}
              onClick={() => mutate({id: event.id})}
              isLoading={isLoading}
            >
              Delete event
            </Button>
          </div>
        </div>
      </div>
    </CardBase>
  );
}
