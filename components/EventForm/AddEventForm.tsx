'use client';

import {useUser} from '@clerk/nextjs';
import {useRouter} from 'next/router';
import {FormProvider} from 'react-hook-form';
import {useCreateEvent} from '../../hooks/useCreateEvent';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';

export function AddEventForm() {
  const {user} = useUser();
  const {push} = useRouter();
  const {handleCreate} = useCreateEvent({
    onSuccess: event => push(`/event/${event.id}`),
  });
  const form = useEventForm();
  const {handleSubmit} = form;

  const onSubmit = handleSubmit(async data => {
    await handleCreate({
      ...data,
      email: user?.primaryEmailAddress?.emailAddress!,
    });
  });

  return (
    <FormProvider {...form}>
      <EventForm onSubmit={onSubmit} />
    </FormProvider>
  );
}
