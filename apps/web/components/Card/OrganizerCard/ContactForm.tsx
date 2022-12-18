import {Event} from '@prisma/client';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {trpc} from '../../../utils/trpc';
import {Button} from '../../Button/Button';
import {Input} from '../../Input/Input/Input';
import {Textarea} from '../../Input/Input/Textarea';
import {Modal} from '../../Modal/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

interface Form {
  subject: string;
  message: string;
  firstName: string;
  lastName: string;
  email: string;
}

export function ContactForm({isOpen, onClose, event}: Props) {
  const sendEmail = trpc.mail.sendQuestionToOrganizer.useMutation();
  const {register, handleSubmit} = useForm<Form>();

  const onSubmit = handleSubmit(async data => {
    await sendEmail.mutateAsync({...data, eventId: event.id});
    toast.success('Email sent, we will get back to you soon!');
    onClose();
  });

  return (
    <Modal title="Ask a question" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Input {...register('firstName')} placeholder="First name" />
          </div>
          <div className="col-span-6">
            <Input {...register('lastName')} placeholder="Last name" />
          </div>
          <div className="col-span-12">
            <Input {...register('email')} placeholder="Email" />
          </div>
          <div className="col-span-12">
            <Input {...register('subject')} placeholder="Subject" />
          </div>
          <div className="col-span-12">
            <Textarea {...register('message')} placeholder="Message" />
          </div>
          <div className="col-span-12 flex gap-x-2">
            <Button onClick={onClose} variant="neutral">
              Cancel
            </Button>
            <Button type="submit" isLoading={sendEmail.isLoading}>
              Send
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
