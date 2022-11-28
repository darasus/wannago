import {useRouter} from 'next/router';
import {Button} from '../Button/Button';
import {PencilIcon, TrashIcon} from '@heroicons/react/24/solid';
import {useDeleteEvent} from '../../hooks/useDeleteEvent';

interface Props {
  eventId: string;
}

export function EditControls({eventId}: Props) {
  const router = useRouter();
  const {handleDelete, isLoading: isDeleting} = useDeleteEvent({
    onSuccess: () => router.push('/dashboard'),
  });

  return (
    <div className="p-2 rounded-md absolute top-2 right-2 z-10 bg-gray-100">
      <Button
        className="px-2 py-2 mr-2"
        variant="secondary"
        size="xl"
        iconLeft={<PencilIcon className="h-5 w-5" aria-hidden="true" />}
        onClick={() => router.push(`/event/${eventId}/edit`)}
      />
      <Button
        isLoading={isDeleting}
        className="px-2 py-2"
        variant="danger"
        size="xs"
        iconLeft={<TrashIcon className="h-5 w-5" aria-hidden="true" />}
        onClick={() => handleDelete(eventId)}
      />
    </div>
  );
}
