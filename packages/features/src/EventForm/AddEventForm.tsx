'use client';

import {zonedTimeToUtc} from 'date-fns-tz';
import {useRouter} from 'next/navigation';
import {FormProvider} from 'react-hook-form';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';
import {toast} from 'sonner';
import {useTracker} from 'hooks';
import {api} from '../../../../apps/web/src/trpc/client';
import {User} from '@prisma/client';

interface Props {
  me: User;
}

export function AddEventForm({me}: Props) {
  const {logEvent} = useTracker();
  const router = useRouter();
  const form = useEventForm({me});
  const {handleSubmit} = form;

  const onSubmit = handleSubmit(async (data) => {
    logEvent('event_create_submitted');

    await api.event.create
      .mutate({
        ...data,
        tickets:
          data.tickets?.map((ticket) => ({
            ...ticket,
            price: Number(ticket.price) * 100,
            maxQuantity: Number(ticket.maxQuantity),
          })) || [],
        description: data.description === '<p></p>' ? null : data.description,
        startDate: zonedTimeToUtc(
          data.startDate,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        ),
        endDate: zonedTimeToUtc(
          data.endDate,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        ),
      })
      .then((data) => {
        logEvent('event_created', {
          eventId: data?.id,
        });
        if (data?.id) {
          router.push(`/e/${data.shortId}`);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        form.trigger();
      });
  });

  return (
    <FormProvider {...form}>
      <EventForm
        onSubmit={onSubmit}
        onCancelClick={() => router.push(`/events`)}
      />
    </FormProvider>
  );
}
