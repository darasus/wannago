import {EnvelopeIcon} from '@heroicons/react/24/solid';
import {useRouter} from 'next/router';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {trpc} from '../../utils/trpc';
import {Button} from '../../components/Button/Button';
import {MessageParticipantsFormModal} from '../../components/MessageParticipantsFormModal/MessageParticipantsFormModal';

interface Form {
  subject: string;
  message: string;
}

export function MessageParticipantsButton() {
  const router = useRouter();
  const eventId = router.query.id as string;
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
