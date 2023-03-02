import {Event} from '@prisma/client';
import {useMemo} from 'react';
import {useForm} from 'react-hook-form';
import {formatDate} from 'utils';
import {Form} from '../types';

const formatDateForInput = (date: Date | string) => {
  return formatDate(new Date(date), "yyyy-MM-dd'T'HH:mm");
};

export function useEventForm(props?: {event?: Event}) {
  const {event} = props || {};

  const type = useMemo(() => {
    if (event?.address) {
      return 'offline';
    }
    if (event?.streamUrl) {
      return 'online';
    }
    return 'offline';
  }, [event?.address, event?.streamUrl]);

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
      address: event?.address || undefined,
      streamUrl: event?.streamUrl || undefined,
      maxNumberOfAttendees: event?.maxNumberOfAttendees || undefined,
      featuredImageSrc: event?.featuredImageSrc || undefined,
      featuredImageHeight: event?.featuredImageHeight || undefined,
      featuredImageWidth: event?.featuredImageWidth || undefined,
      featuredImagePreviewSrc: event?.featuredImagePreviewSrc || undefined,
      type,
    },
  });

  return form;
}
