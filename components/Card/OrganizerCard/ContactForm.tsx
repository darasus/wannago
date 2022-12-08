import {Dialog, Transition} from '@headlessui/react';
import {Event} from '@prisma/client';
import {Fragment} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {trpc} from '../../../utils/trpc';
import {Button} from '../../Button/Button';
import {Input} from '../../Input/Input/Input';
import {Textarea} from '../../Input/Input/Textarea';

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
  const sendEmail = trpc.mailgun.sendQuestionToOrganizer.useMutation();
  const {register, handleSubmit} = useForm<Form>();

  const onSubmit = handleSubmit(async data => {
    await sendEmail.mutateAsync({...data, eventId: event.id});
    toast.success('Email sent, we will get back to you soon!');
    onClose();
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Ask organizer
                </Dialog.Title>
                <div className="mt-2">
                  <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-6">
                        <Input
                          {...register('firstName')}
                          placeholder="First name"
                        />
                      </div>
                      <div className="col-span-6">
                        <Input
                          {...register('lastName')}
                          placeholder="Last name"
                        />
                      </div>
                      <div className="col-span-12">
                        <Input {...register('email')} placeholder="Email" />
                      </div>
                      <div className="col-span-12">
                        <Input {...register('subject')} placeholder="Subject" />
                      </div>
                      <div className="col-span-12">
                        <Textarea
                          {...register('message')}
                          placeholder="Message"
                        />
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
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
