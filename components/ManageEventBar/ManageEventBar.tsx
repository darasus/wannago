'use client';

import {useRouter} from 'next/navigation';
import {useDeleteEvent} from '../../hooks/useDeleteEvent';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';

interface Props {
  id: string;
}

export function ManageEventBar({id}: Props) {
  const {push} = useRouter();
  const {deleteEvent} = useDeleteEvent(id);

  const handleEditClick = () => {
    push(`/event/${id}/edit`);
  };

  const handleDeleteClick = async () => {
    await deleteEvent();
    push('/');
  };

  return (
    <Card>
      <div>
        <Button variant="secondary" className="mr-4" onClick={handleEditClick}>
          Edit
        </Button>
        <Button variant="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
