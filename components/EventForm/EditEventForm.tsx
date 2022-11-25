'use client';

import {Event} from '@prisma/client';
import {useRouter} from 'next/router';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';
import {useEditEvent} from '../../hooks/useEditEvent';
import {useUser} from '@clerk/nextjs';

interface Props {
  event: Event;
}

export function EditEventForm({event}: Props) {
  const {push} = useRouter();
  const {user} = useUser();
  const {handleEdit, isLoading} = useEditEvent({
    onSuccess: () => push(`/event/${event.id}`),
  });
  const {handleSubmit, register} = useEventForm({
    event,
  });

  const onSubmit = handleSubmit(async data => {
    await handleEdit({
      ...data,
      email: user?.primaryEmailAddress?.emailAddress!,
      id: event.id,
    });
  });

  return (
    <EventForm onSubmit={onSubmit} register={register} isLoading={isLoading} />
  );
}
