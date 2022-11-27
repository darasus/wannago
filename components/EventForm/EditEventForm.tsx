'use client';

import {Event} from '@prisma/client';
import {useRouter} from 'next/router';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';
import {useEditEvent} from '../../hooks/useEditEvent';
import {useUser} from '@clerk/nextjs';
import {FormProvider} from 'react-hook-form';

interface Props {
  event: Event;
}

export function EditEventForm({event}: Props) {
  const {push} = useRouter();
  const {user} = useUser();
  const {handleEdit} = useEditEvent({
    onSuccess: () => push(`/event/${event.id}`),
  });
  const form = useEventForm({
    event,
  });

  const {handleSubmit, register, control, setValue} = form;

  const onSubmit = handleSubmit(async data => {
    await handleEdit({
      ...data,
      email: user?.primaryEmailAddress?.emailAddress!,
      id: event.id,
    });
  });

  return (
    <FormProvider {...form}>
      <EventForm onSubmit={onSubmit} />
    </FormProvider>
  );
}
