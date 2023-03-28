import {UseFormRegister} from 'react-hook-form';
import {Button, Modal} from 'ui';
import {Input} from '../Input/Input/Input';
import {Textarea} from '../Input/Input/Textarea';

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
              isLoading={isSubmitting}
              type="submit"
              data-testid="message-attendees-form-submit"
            >
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
