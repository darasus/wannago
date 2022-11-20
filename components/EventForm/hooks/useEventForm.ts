'use client';

import {useUser} from '@clerk/nextjs';
import {Event} from '@prisma/client';
import {format} from 'date-fns';
import {useForm} from 'react-hook-form';
import {EventOutput} from '../../../model';
import {Form} from '../types';

export function useEventForm({
  event,
  onSuccess,
}: {
  event?: Event;
  onSuccess?: (event: Event) => void;
}) {
  const {user} = useUser();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Form>({
    defaultValues: {
      title: event?.title,
      startDate: event?.startDate
        ? format(new Date(event?.startDate), "yyyy-MM-dd'T'hh:mm")
        : undefined,
      endDate: event?.endDate
        ? format(new Date(event?.endDate), "yyyy-MM-dd'T'hh:mm")
        : undefined,
      description: event?.description,
      address: event?.address,
      maxNumberOfAttendees: event?.maxNumberOfAttendees || undefined,
    },
  });

  console.log(errors);

  const onSubmitCreate = handleSubmit(async data => {
    const response = await fetch('/api/createEvent', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        email: user?.primaryEmailAddress?.emailAddress,
      }),
    }).then(res => res.json());

    const parsedEvent = EventOutput.parse(response);

    onSuccess?.(parsedEvent);
  });

  const onSubmitEdit = handleSubmit(async data => {
    const response = await fetch('/api/editEvent', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        id: event?.id,
        email: user?.primaryEmailAddress?.emailAddress,
      }),
    }).then(res => res.json());

    const parsedEvent = EventOutput.parse(response);

    onSuccess?.(parsedEvent);
  });

  return {register, onSubmitCreate, onSubmitEdit};
}
