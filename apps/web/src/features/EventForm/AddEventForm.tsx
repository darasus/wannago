'use client';

import {zonedTimeToUtc} from 'date-fns-tz';
import {useRouter} from 'next/navigation';
import {FormProvider} from 'react-hook-form';
import {trackEventCreateConversion} from 'lib/src/gtag';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';
import {toast} from 'sonner';
import {useTracker} from 'hooks';
import {api} from '../../trpc/client';
import {Organization, User} from '@prisma/client';

interface Props {
  me: User;
  myOrganizations: Organization[];
}

export function AddEventForm({me, myOrganizations}: Props) {
  const {logEvent} = useTracker();
  const router = useRouter();
  const form = useEventForm({me});
  const {handleSubmit} = form;

  const onSubmit = handleSubmit(async (data) => {
    logEvent('event_create_submitted');
    trackEventCreateConversion();

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
        me={me}
        myOrganizations={myOrganizations}
        onSubmit={onSubmit}
        onCancelClick={() => router.push(`/dashboard`)}
      />
    </FormProvider>
  );
}
