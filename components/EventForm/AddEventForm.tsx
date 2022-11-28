import {useRouter} from 'next/router';
import {FormProvider} from 'react-hook-form';
import {trpc} from '../../utils/trpc';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';

export function AddEventForm() {
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
    await mutateAsync(data);
  });

  return (
    <FormProvider {...form}>
      <EventForm onSubmit={onSubmit} />
    </FormProvider>
  );
}
