import {FormEventHandler} from 'react';
import {useFormContext} from 'react-hook-form';
import {ContactForm} from '../../types/forms';
import {Button, Modal} from 'ui';
import {Input} from '../Input/Input/Input';
import {Textarea} from '../Input/Input/Textarea';

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
            <Input
              type="text"
              {...register('firstName', {
                required: {
                  value: true,
                  message: 'First name is required',
                },
              })}
              placeholder="First name"
            />
          </div>
          <div className="col-span-6">
            <Input
              type="text"
              {...register('lastName', {
                required: {
                  value: true,
                  message: 'Last name is required',
                },
              })}
              placeholder="Last name"
            />
          </div>
          <div className="col-span-12">
            <Input
              type="email"
              {...register('email', {
                required: {
                  value: true,
                  message: 'Email is required',
                },
              })}
              placeholder="Email"
            />
          </div>
          <div className="col-span-12">
            <Input type="text" {...register('subject')} placeholder="Subject" />
          </div>
          <div className="col-span-12">
            <Textarea
              {...register('message', {
                required: {
                  value: true,
                  message: 'Message is required',
                },
              })}
              placeholder="Message"
            />
          </div>
          <div className="col-span-12 flex gap-x-2">
            <Button type="submit" isLoading={isSubmitting}>
              Send
            </Button>
            <Button onClick={onClose} variant="neutral">
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
