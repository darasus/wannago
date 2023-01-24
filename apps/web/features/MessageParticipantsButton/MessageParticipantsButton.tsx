import {EnvelopeIcon} from '@heroicons/react/24/solid';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {trpc} from '../../utils/trpc';
import {Button} from '../../components/Button/Button';
import {MessageParticipantsFormModal} from '../../components/MessageParticipantsFormModal/MessageParticipantsFormModal';
import {useAmplitude} from '../../hooks/useAmplitude';
import {useEventId} from '../../hooks/useEventId';

interface Form {
  subject: string;
  message: string;
}

export function MessageParticipantsButton() {
  const eventId = useEventId();
  const {logEvent} = useAmplitude();
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {isSubmitting},
    reset,
  } = useForm<Form>();
  const messageToUsers = trpc.mail.messageEventParticipants.useMutation();

  const handleOnClick = () => {
    setIsOpen(true);
  };

  const handleOnSubmit = handleSubmit(async data => {
    await messageToUsers.mutateAsync({eventId, ...data});
    toast.success('Message is sent!', {
      duration: 10000,
    });
    setIsOpen(false);
    reset();
    logEvent('event_message_to_attendees_submitted', {
      eventId,
    });
  });

  return (
    <>
      <MessageParticipantsFormModal
        isOpen={isOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsOpen(false)}
        onSubmit={handleOnSubmit}
        register={register}
      />
      <Button
        onClick={handleOnClick}
        variant="neutral"
        iconLeft={<EnvelopeIcon />}
        size="sm"
      >
        Message attendees
      </Button>
    </>
  );
}
