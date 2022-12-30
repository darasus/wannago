import {zonedTimeToUtc} from 'date-fns-tz';
import {useRouter} from 'next/router';
import {FormProvider} from 'react-hook-form';
import {useAmplitude} from '../../hooks/useAmplitude';
import {trackEventCreateConversion} from '../../lib/gtag';
import {trpc} from '../../utils/trpc';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';

export function AddEventForm() {
  const {logEvent} = useAmplitude();
  const router = useRouter();
  const {push} = useRouter();
  const {mutateAsync} = trpc.event.create.useMutation({
    onSuccess(data) {
      logEvent('event_created', {
        eventId: data?.id,
      });
      if (data?.id) {
        push(`/event/${data.id}`);
      }
    },
  });
  const form = useEventForm();
  const {handleSubmit} = form;

  const onSubmit = handleSubmit(async data => {
    logEvent('event_create_submitted');
    trackEventCreateConversion();
    await mutateAsync({
      ...data,
      startDate: zonedTimeToUtc(
        data.startDate,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      ),
      endDate: zonedTimeToUtc(
        data.endDate,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      ),
    });
  });

  return (
    <FormProvider {...form}>
      <EventForm
        onSubmit={onSubmit}
        onCancelClick={() => router.push(`/dashboard`)}
      />
    </FormProvider>
  );
}
