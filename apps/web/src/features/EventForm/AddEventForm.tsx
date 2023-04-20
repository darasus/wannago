import {zonedTimeToUtc} from 'date-fns-tz';
import {useRouter} from 'next/router';
import {FormProvider} from 'react-hook-form';
import {useAmplitude, useCurrentAuthorId} from 'hooks';
import {trackEventCreateConversion} from 'lib/src/gtag';
import {trpc} from 'trpc/src/trpc';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';
import {invariant} from 'utils';
import {toast} from 'react-hot-toast';

export function AddEventForm() {
  const {logEvent} = useAmplitude();
  const {authorId} = useCurrentAuthorId();
  const router = useRouter();
  const {push} = useRouter();
  const createMutation = trpc.event.create.useMutation({
    onSuccess(data) {
      logEvent('event_created', {
        eventId: data?.id,
      });
      if (data?.id) {
        push(`/e/${data.shortId}`);
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const utils = trpc.useContext();
  const form = useEventForm();
  const {handleSubmit} = form;

  const onSubmit = handleSubmit(async data => {
    logEvent('event_create_submitted');
    trackEventCreateConversion();

    invariant(authorId);

    await createMutation
      .mutateAsync({
        authorId,
        ...data,
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
      .then(async res => {
        await utils.event.getByShortId.prefetch({id: res.shortId});
      })
      .catch(() => {
        form.trigger();
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
