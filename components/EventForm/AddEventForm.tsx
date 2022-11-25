'use client';

import {useUser} from '@clerk/nextjs';
import {useRouter} from 'next/router';
import {useCreateEvent} from '../../hooks/useCreateEvent';
import {api} from '../../lib/api';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';

export function AddEventForm() {
  const {user} = useUser();
  const {push} = useRouter();
  const {handleCreate, isLoading} = useCreateEvent({
    onSuccess: event => push(`/event/${event.id}`),
  });
  const {handleSubmit, register} = useEventForm({});

  const onSubmit = handleSubmit(async data => {
    await handleCreate({
      ...data,
      email: user?.primaryEmailAddress?.emailAddress!,
    });
  });

  return (
    <EventForm onSubmit={onSubmit} register={register} isLoading={isLoading} />
  );
}
