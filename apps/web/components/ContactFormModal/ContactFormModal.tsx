import {FormEventHandler} from 'react';
import {useFormContext} from 'react-hook-form';
import {ContactForm} from '../../types/forms';
import {Button} from '../Button/Button';
import {Input} from '../Input/Input/Input';
import {Textarea} from '../Input/Input/Textarea';
import {Modal} from '../Modal/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler;
}

export function ContactFormModal({isOpen, onClose, onSubmit}: Props) {
  const {
    register,
    formState: {isSubmitting},
  } = useFormContext<ContactForm>();

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
            <Button type="submit" isLoading={isSubmitting}>
              Send
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
