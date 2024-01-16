'use client';

import {useRouter} from 'next/navigation';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';
import {FormProvider} from 'react-hook-form';
import {zonedTimeToUtc} from 'date-fns-tz';
import {useTracker} from 'hooks';
import {PageHeader} from 'ui';
import {Event, Ticket, User} from '@prisma/client';
import {toast} from 'sonner';
import {api} from '../../../../apps/web/src/trpc/client';

interface Props {
  event: Event & {tickets: Ticket[]};
  me: User;
}

export function EditEventForm({event, me}: Props) {
  const {logEvent} = useTracker();
  const router = useRouter();
  const form = useEventForm({
    event,
    me,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    logEvent('event_update_submitted');

    if (event?.id) {
      await api.event.update
        .mutate({
          ...data,
          tickets:
            data.tickets?.map((ticket) => ({
              ...ticket,
              price: Number(ticket.price) * 100,
              maxQuantity: Number(ticket.maxQuantity),
            })) || [],
          description: data.description || null,
          eventId: event.id,
          startDate: zonedTimeToUtc(
            data.startDate,
            Intl.DateTimeFormat().resolvedOptions().timeZone
          ),
          endDate: zonedTimeToUtc(
            data.endDate,
            Intl.DateTimeFormat().resolvedOptions().timeZone
          ),
          maxNumberOfAttendees: Number(data.maxNumberOfAttendees) || 0,
          featuredImageSrc: data.featuredImageSrc || null,
          featuredImageHeight: Number(data.featuredImageHeight) || null,
          featuredImageWidth: Number(data.featuredImageWidth) || null,
          featuredImagePreviewSrc: data.featuredImagePreviewSrc || null,
        })
        .then((data) => {
          logEvent('event_updated', {
            eventId: data?.id,
          });
          router.refresh();
          router.push(`/e/${data.shortId}`);
        })
        .catch((error) => {
          form.trigger();
          toast.error(error.message);
        });
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Edit event" />
      <FormProvider {...form}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-12">
            <EventForm
              onSubmit={onSubmit}
              onCancelClick={() => router.push(`/e/${event?.shortId}`)}
            />
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
