import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Button, Modal} from 'ui';
import {AdminInviteForm} from '../../../../../../../types/forms';
import {trpc} from 'trpc/src/trpc';
import {useEventId} from 'hooks';
import {toast} from 'react-hot-toast';
import {Input} from '../../../../../../../components/Input/Input/Input';

export function EventInviteButton() {
  const [on, set] = useState(false);
  const {eventShortId} = useEventId();
  const {refetch} = trpc.event.getAttendees.useQuery(
    {
      eventShortId: eventShortId!,
    },
    {
      enabled: !!eventShortId,
    }
  );
  const {
    handleSubmit,
    reset,
    register,
    formState: {isSubmitting, errors},
  } = useForm<AdminInviteForm>();
  const {mutateAsync} = trpc.event.inviteByEmail.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success('Invitation sent!');
    },
  });

  const onSubmit = handleSubmit(async data => {
    if (eventShortId) {
      await mutateAsync({...data, eventShortId});
      await refetch();
      reset();
      set(false);
    }
  });

  return (
    <>
      <Modal title="Invite by email" isOpen={on} onClose={() => set(false)}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-12 gap-2 grow mr-2">
            <div className="col-span-6">
              <Input
                placeholder="First name"
                {...register('firstName', {
                  required: 'First name is required',
                })}
                error={errors.firstName}
                data-testid="invite-by-email-first-name-input"
              />
            </div>
            <div className="col-span-6">
              <Input
                placeholder="Last name"
                {...register('lastName', {
                  required: 'Last name is required',
                })}
                error={errors.lastName}
                data-testid="invite-by-email-last-name-input"
              />
            </div>
            <div className="col-span-12">
              <Input
                placeholder="Email"
                {...register('email', {
                  required: 'Email is required',
                })}
                error={errors.email}
                data-testid="invite-by-email-email-input"
              />
            </div>
            <div className="col-span-4">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
                data-testid="invite-by-email-submit-button"
              >
                Invite
              </Button>
            </div>
          </div>
        </form>
      </Modal>
      <Button
        size="sm"
        variant="neutral"
        onClick={() => set(true)}
        data-testid="invite-by-email-open-modal-button"
      >
        Invite by email
      </Button>
    </>
  );
}
