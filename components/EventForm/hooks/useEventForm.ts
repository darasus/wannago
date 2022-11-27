'use client';

import {Event} from '@prisma/client';
import {format} from 'date-fns';
import {useForm} from 'react-hook-form';
import {Form} from '../types';

export function useEventForm(props?: {event?: Event}) {
  const {event} = props || {};
  const form = useForm<Form>({
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
      featuredImageSrc: event?.featuredImageSrc || undefined,
    },
  });

  return form;
}
