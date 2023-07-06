'use client';

import {useRouter} from 'next/navigation';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';
import {FormProvider} from 'react-hook-form';
import {zonedTimeToUtc} from 'date-fns-tz';
import {useAmplitude} from 'hooks';
import {PageHeader} from 'ui';
import {Event, Organization, Ticket, User} from '@prisma/client';
import {updateEvent} from './actions';
import {toast} from 'react-hot-toast';

interface Props {
  event: Event & {tickets: Ticket[]};
  me: User;
  myOrganizations: Organization[];
}

export function EditEventForm({event, me, myOrganizations}: Props) {
  const {logEvent} = useAmplitude();
  const router = useRouter();
  const form = useEventForm({
    event,
    me,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    logEvent('event_update_submitted');

    if (event?.id) {
      await updateEvent({
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
              me={me}
              myOrganizations={myOrganizations}
              onSubmit={onSubmit}
              onCancelClick={() => router.push(`/e/${event?.shortId}`)}
            />
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
