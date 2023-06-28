'use client';

import {UseFormRegister} from 'react-hook-form';
import {Button, Modal} from 'ui';
import {Input} from '../../../../../../../../../../components/Input/Input/Input';
import {Textarea} from '../../../../../../../../../../components/Input/Input/Textarea';
import {useLoadingToast} from 'hooks';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  register: UseFormRegister<{subject: string; message: string}>;
}

export function MessageParticipantsFormModal({
  isOpen,
  isSubmitting,
  register,
  onClose,
  onSubmit,
}: Props) {
  useLoadingToast({isLoading: isSubmitting});

  return (
    <Modal
      isOpen={isOpen}
      title="Get in touch with participants"
      onClose={onClose}
    >
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-y-4">
          <div>
            <Input
              {...register('subject')}
              placeholder="Subject"
              data-testid="message-attendees-input-subject"
            />
          </div>
          <div>
            <Textarea
              {...register('message')}
              placeholder="Message"
              data-testid="message-attendees-input-message"
            />
          </div>
          <div className="flex justify-start gap-x-2">
            <Button
              disabled={isSubmitting}
              type="submit"
              data-testid="message-attendees-form-submit"
            >
              Send
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
