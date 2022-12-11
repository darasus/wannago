import {Event} from '@prisma/client';
import {useForm} from 'react-hook-form';
import {formatDate} from '../../../utils/formatDate';
import {Form} from '../types';

export function useEventForm(props?: {event?: Event}) {
  const {event} = props || {};
  const form = useForm<Form>({
    defaultValues: {
      title: event?.title,
      startDate: event?.startDate
        ? formatDate(new Date(event?.startDate), "yyyy-MM-dd'T'HH:mm")
        : undefined,
      endDate: event?.endDate
        ? formatDate(new Date(event?.endDate), "yyyy-MM-dd'T'HH:mm")
        : undefined,
      description: event?.description,
      address: event?.address,
      maxNumberOfAttendees: event?.maxNumberOfAttendees || undefined,
      featuredImageSrc: event?.featuredImageSrc || undefined,
    },
  });

  return form;
}
