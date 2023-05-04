import {Event, Ticket} from '@prisma/client';
import {useForm} from 'react-hook-form';
import {formatDate} from 'utils';
import {Form} from '../types';

const formatDateForInput = (date: Date | string) => {
  return formatDate(new Date(date), "yyyy-MM-dd'T'HH:mm");
};

export function useEventForm(props?: {
  event?: (Event & {tickets: Ticket[]}) | null;
}) {
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
      description: event?.description || null,
      address: event?.address || undefined,
      maxNumberOfAttendees: event?.maxNumberOfAttendees || undefined,
      featuredImageSrc: event?.featuredImageSrc || null,
      featuredImageHeight: event?.featuredImageHeight || null,
      featuredImageWidth: event?.featuredImageWidth || null,
      featuredImagePreviewSrc: event?.featuredImagePreviewSrc || null,
      tickets:
        event?.tickets?.map(ticket => {
          return {
            id: ticket.id,
            title: ticket.title,
            price: (ticket.price / 100).toString(),
            maxQuantity: ticket.maxQuantity.toString(),
          };
        }) || [],
    },
  });

  return form;
}
