import {Event} from '@prisma/client';
import {useRouter} from 'next/router';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';
import {FormProvider} from 'react-hook-form';
import {trpc} from '../../utils/trpc';
import {zonedTimeToUtc} from 'date-fns-tz';

interface Props {
  event: Event;
}

export function EditEventForm({event}: Props) {
  const {push} = useRouter();
  const {mutateAsync} = trpc.event.update.useMutation({
    onSuccess: data => {
      push(`/event/${data.id}`);
    },
  });
  const form = useEventForm({
    event,
  });

  const {handleSubmit} = form;

  const onSubmit = handleSubmit(async data => {
    await mutateAsync({
      ...data,
      eventId: event.id,
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
      <EventForm onSubmit={onSubmit} isEdit />
    </FormProvider>
  );
}
