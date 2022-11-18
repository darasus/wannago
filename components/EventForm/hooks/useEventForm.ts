'use client';

import {useUser} from '@clerk/nextjs';
import {Event} from '@prisma/client';
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
      startDate: event?.startDate,
      endDate: event?.endDate,
      description: event?.description,
      address: event?.address,
    },
  });

  console.error(errors);

  const onSubmit = handleSubmit(async data => {
    const response = await fetch('/api/createEvent', {
      method: 'POST',
      body: JSON.stringify({...data, email: user?.primaryEmailAddress}),
    }).then(res => res.json());

    const event = EventOutput.parse(response);

    onSuccess?.(event);
  });

  return {register, onSubmit};
}
