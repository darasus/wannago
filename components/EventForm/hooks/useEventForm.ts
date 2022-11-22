'use client';

import {useUser} from '@clerk/nextjs';
import {Event} from '@prisma/client';
import {format} from 'date-fns';
import {useForm} from 'react-hook-form';
import {api} from '../../../lib/api';
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

  const onSubmitCreate = handleSubmit(async data => {
    const response = await api.createEvent({
      ...data,
      email: user?.primaryEmailAddress?.emailAddress!,
    });

    onSuccess?.(response);
  });

  const onSubmitEdit = handleSubmit(async data => {
    const response = await api.editEvent({
      ...data,
      id: event?.id!,
      email: user?.primaryEmailAddress?.emailAddress!,
    });

    onSuccess?.(response);
  });

  return {register, onSubmitCreate, onSubmitEdit};
}
