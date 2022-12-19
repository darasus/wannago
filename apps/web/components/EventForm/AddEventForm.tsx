import {zonedTimeToUtc} from 'date-fns-tz';
import {useRouter} from 'next/router';
import {FormProvider} from 'react-hook-form';
import {trpc} from '../../utils/trpc';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';

export function AddEventForm() {
  const router = useRouter();
  const {push} = useRouter();
  const {mutateAsync} = trpc.event.create.useMutation({
    onSettled(data) {
      if (data?.id) {
        push(`/event/${data.id}`);
      }
    },
  });
  const form = useEventForm();
  const {handleSubmit} = form;

  const onSubmit = handleSubmit(async data => {
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
