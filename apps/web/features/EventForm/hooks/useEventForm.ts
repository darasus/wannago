import {Event} from '@prisma/client';
import {useForm} from 'react-hook-form';
import {formatDate} from '../../../utils/formatDate';
import {Form} from '../types';

const formatDateForInput = (date: Date | string) => {
  return formatDate(new Date(date), "yyyy-MM-dd'T'HH:mm");
};

export function useEventForm(props?: {event?: Event}) {
  const {event} = props || {};
  const form = useForm<Form>({
    defaultValues: {
      title: event?.title,
      startDate: event?.startDate
        ? formatDateForInput(event?.startDate)
        : formatDateForInput(new Date()),
      endDate: event?.endDate
        ? formatDateForInput(event?.endDate)
        : formatDateForInput(new Date()),
      description: event?.description,
      address: event?.address,
      maxNumberOfAttendees: event?.maxNumberOfAttendees || undefined,
      featuredImageSrc: event?.featuredImageSrc || undefined,
      featuredImageHeight: event?.featuredImageHeight || undefined,
      featuredImageWidth: event?.featuredImageWidth || undefined,
      featuredImagePreviewSrc: event?.featuredImagePreviewSrc || undefined,
    },
  });

  return form;
}
