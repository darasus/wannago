import {EmailAddressResource} from '@clerk/types';
import {useMe} from 'hooks';
import {useRef} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {Button, Modal, Text} from 'ui';
import {Input} from '../../components/Input/Input/Input';

type EmailForm = {
  email: string;
};

type CodeForm = {
  code: string;
};

interface Props {
  isEmailFormOpen: boolean;
  isCodeFormOpen: boolean;
  onClose: () => void;
}

export function AddEmailModal({
  onClose,
  isCodeFormOpen,
  isEmailFormOpen,
}: Props) {
  const {clerkMe} = useMe();
  const emailForm = useForm<EmailForm>();
  const codeForm = useForm<CodeForm>();
  const emailCreateAttemptRef = useRef<EmailAddressResource | null>(null);

  const onEmailSubmit = emailForm.handleSubmit(async data => {
    try {
      const emailCreateAttempt = await clerkMe?.createEmailAddress({
        email: data.email,
      });
      await emailCreateAttempt?.prepareVerification({strategy: 'email_code'});
      emailCreateAttemptRef.current = emailCreateAttempt || null;
      emailForm.reset();
      toast.success('Email is successfully added!');
      onClose();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  });

  const onCodeSubmit = codeForm.handleSubmit(async data => {
    try {
      emailCreateAttemptRef.current?.attemptVerification({
        code: data.code,
      });
      codeForm.reset();
      toast.success('Verification is successful!');
      onClose();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  });

  return (
    <>
      <Modal title="Add email" isOpen={isEmailFormOpen} onClose={onClose}>
        <div className="flex flex-col">
          <div className="flex">
            <form
              className="flex grow items-end gap-2"
              onSubmit={onEmailSubmit}
            >
              <div className="grow">
                <Input
                  type="email"
                  {...emailForm.register(`email`)}
                  placeholder="Type your email here..."
                />
              </div>
              <Button type="submit" disabled={emailForm.formState.isSubmitting}>
                Add
              </Button>
            </form>
          </div>
        </div>
      </Modal>
      <Modal
        title="Confirm one time password"
        isOpen={isCodeFormOpen}
        onClose={onClose}
      >
        <div className="flex flex-col">
          <div className="mb-4">
            <Text>Enter the verification code sent to indicated email</Text>
          </div>
          <form className="flex grow items-end gap-4" onSubmit={onCodeSubmit}>
            <div className="grow">
              <Input
                type="number"
                {...codeForm.register(`code`)}
                placeholder="Type verification code here..."
              />
            </div>
            <Button type="submit" disabled={codeForm.formState.isSubmitting}>
              Submit
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
}
