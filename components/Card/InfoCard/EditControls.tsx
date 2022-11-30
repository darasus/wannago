import {useRouter} from 'next/router';
import {Button} from '../../Button/Button';
import {PencilIcon, TrashIcon, UsersIcon} from '@heroicons/react/24/solid';
import {trpc} from '../../../utils/trpc';

interface Props {
  eventId: string;
}

export function EditControls({eventId}: Props) {
  const router = useRouter();
  const {mutate, isLoading} = trpc.event.remove.useMutation({
    onSuccess: () => router.push('/dashboard'),
  });

  return (
    <div className="p-2 rounded-md absolute top-2 right-2 z-10 bg-gray-100">
      <Button
        className="px-2 py-2 mr-2"
        variant="secondary"
        size="xl"
        iconLeft={<UsersIcon className="h-5 w-5" aria-hidden="true" />}
        onClick={() => router.push(`/event/${eventId}/attendees`)}
      />
      <Button
        className="px-2 py-2 mr-2"
        variant="secondary"
        size="xl"
        iconLeft={<PencilIcon className="h-5 w-5" aria-hidden="true" />}
        onClick={() => router.push(`/event/${eventId}/edit`)}
      />
      <Button
        isLoading={isLoading}
        className="px-2 py-2"
        variant="danger"
        size="xs"
        iconLeft={<TrashIcon className="h-5 w-5" aria-hidden="true" />}
        onClick={() => mutate({id: eventId})}
      />
    </div>
  );
}
