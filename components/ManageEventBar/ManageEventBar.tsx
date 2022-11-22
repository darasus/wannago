'use client';

import {useRouter} from 'next/router';
import {api} from '../../lib/api';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';

interface Props {
  id: string;
}

export function ManageEventBar({id}: Props) {
  const {push} = useRouter();

  const handleEditClick = () => {
    push(`/event/${id}/edit`);
  };

  const handleDeleteClick = async () => {
    await api.deleteEvent(id);
    push('/');
  };

  return (
    <Card>
      <div>
        <Button variant="link" className="mr-4" onClick={handleEditClick}>
          Edit
        </Button>
        <Button variant="link-neutral" onClick={handleDeleteClick}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
