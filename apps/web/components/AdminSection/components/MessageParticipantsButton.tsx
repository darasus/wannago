import {EnvelopeIcon} from '@heroicons/react/24/solid';
import {useRouter} from 'next/router';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {trpc} from '../../../utils/trpc';
import {Button} from '../../Button/Button';
import {Input} from '../../Input/Input/Input';
import {Textarea} from '../../Input/Input/Textarea';
import {Modal} from '../../Modal/Modal';

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
    toast.success('Message is sent!');
    setIsOpen(false);
    reset();
  });

  return (
    <>
      <Modal
        isOpen={isOpen}
        title="Get in touch with participants"
        onClose={() => setIsOpen(false)}
      >
        <form onSubmit={handleOnSubmit}>
          <div className="flex flex-col gap-y-4">
            <div>
              <Input {...register('subject')} placeholder="Subject" />
            </div>
            <div>
              <Textarea {...register('message')} placeholder="Message" />
            </div>
            <div>
              <Button isLoading={isSubmitting} type="submit">
                Send
              </Button>
            </div>
          </div>
        </form>
      </Modal>
      <Button
        onClick={handleOnClick}
        variant="neutral"
        iconLeft={<EnvelopeIcon className="h-3 w-3" />}
        size="xs"
      >
        Message participants
      </Button>
    </>
  );
}
