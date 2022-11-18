'use client';

import {useRouter} from 'next/navigation';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';

export function AddEventForm() {
  const {push} = useRouter();
  const {onSubmit, register} = useEventForm({
    onSuccess: event => push(`/event/${event.id}`),
  });

  return <EventForm onSubmit={onSubmit} register={register} />;
}
