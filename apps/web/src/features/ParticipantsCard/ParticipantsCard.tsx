import {Event} from '@prisma/client';
import {FormProvider, useForm} from 'react-hook-form';
import {ParticipantsCard as ParticipantsCardView} from 'cards/src/ParticipantsCard/ParticipantsCard';
import {trpc} from 'trpc/src/trpc';
import {toast} from 'react-hot-toast';
import {useAttendeeCount} from 'hooks';
import {useAmplitude} from 'hooks';
import {JoinForm} from '../../types/forms';
import {useConfetti} from 'hooks';

interface Props {
  event: Event;
}

export function ParticipantsCard({event}: Props) {
  const {confetti} = useConfetti();
  const {logEvent} = useAmplitude();
  const {data, refetch} = useAttendeeCount({eventId: event.id});
  const form = useForm<JoinForm>();
  const {handleSubmit, reset} = form;
  const {mutateAsync} = trpc.event.join.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      logEvent('event_sign_up_submitted', {
        eventId: event.id,
      });
      toast.success('Signed up! Check your email for more details!');
      confetti();
    },
  });

  const onSubmit = handleSubmit(async data => {
    try {
      await mutateAsync({eventId: event.id, ...data});
      await refetch();
      reset();
    } catch (error) {}
  });

  const numberOfAttendees =
    typeof data?.count === 'number'
      ? `${data?.count} people attending`
      : 'Loading...';

  return (
    <FormProvider {...form}>
      <ParticipantsCardView
        onSubmit={onSubmit}
        numberOfAttendees={numberOfAttendees}
        isPublished={event.isPublished ?? false}
      />
    </FormProvider>
  );
}
