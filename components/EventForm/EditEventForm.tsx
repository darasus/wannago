'use client';

import {Event} from '@prisma/client';
import {useRouter} from 'next/router';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';

interface Props {
  event: Event;
}

export function EditEventForm({event}: Props) {
  const {push} = useRouter();
  const {onSubmitEdit, register} = useEventForm({
    event,
    onSuccess: () => push(`/event/${event.id}`),
  });

  return <EventForm onSubmit={onSubmitEdit} register={register} />;
}
