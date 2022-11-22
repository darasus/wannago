'use client';

import {useRouter} from 'next/router';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';

export function AddEventForm() {
  const {push} = useRouter();
  const {onSubmitCreate, register} = useEventForm({
    onSuccess: event => push(`/event/${event.id}`),
  });

  return <EventForm onSubmit={onSubmitCreate} register={register} />;
}
