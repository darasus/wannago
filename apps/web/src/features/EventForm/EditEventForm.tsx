import {useRouter} from 'next/router';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';
import {FormProvider} from 'react-hook-form';
import {zonedTimeToUtc} from 'date-fns-tz';
import {trpc} from 'trpc/src/trpc';
import {useAmplitude, useEventId, useEventQuery} from 'hooks';
import {PageHeader} from 'ui';

export function EditEventForm() {
  const {eventShortId} = useEventId();
  const {data: event} = useEventQuery({eventShortId});
  const {logEvent} = useAmplitude();
  const router = useRouter();
  const {push} = useRouter();
  const updateMutation = trpc.event.update.useMutation({
    onSuccess: data => {
      logEvent('event_updated', {
        eventId: data?.id,
      });
      push(`/e/${data.shortId}`);
    },
  });
  const form = useEventForm({
    event,
  });

  const onSubmit = form.handleSubmit(async data => {
    logEvent('event_update_submitted');

    if (event?.id) {
      await updateMutation
        .mutateAsync({
          ...data,
          description: data.description === '<p></p>' ? null : data.description,
          eventId: event.id,
          startDate: zonedTimeToUtc(
            data.startDate,
            Intl.DateTimeFormat().resolvedOptions().timeZone
          ),
          endDate: zonedTimeToUtc(
            data.endDate,
            Intl.DateTimeFormat().resolvedOptions().timeZone
          ),
        })
        .catch(() => {
          form.trigger();
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
              isEdit
              onCancelClick={() => router.push(`/e/${event?.shortId}`)}
            />
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
