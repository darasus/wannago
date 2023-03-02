import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Button, Modal} from 'ui';
import {AdminInviteForm} from '../../types/forms';
import {trpc} from 'trpc/src/trpc';
import {useEventId} from 'hooks';
import {toast} from 'react-hot-toast';
import {Input} from '../../components/Input/Input/Input';

interface Props {
  refetch: () => Promise<any>;
}

export function AdminInviteButton({refetch}: Props) {
  const eventId = useEventId();
  const [on, set] = useState(false);
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
    await mutateAsync({...data, eventId});
    await refetch();
    reset();
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
              />
            </div>
            <div className="col-span-6">
              <Input
                placeholder="Last name"
                {...register('lastName', {
                  required: 'Last name is required',
                })}
                error={errors.lastName}
              />
            </div>
            <div className="col-span-8">
              <Input
                placeholder="Email"
                {...register('email', {
                  required: 'Email is required',
                })}
                error={errors.email}
              />
            </div>
            <div className="col-span-4">
              <Button type="submit" isLoading={isSubmitting} className="w-full">
                Invite
              </Button>
            </div>
          </div>
        </form>
      </Modal>
      <Button size="sm" variant="neutral" onClick={() => set(true)}>
        Invite by email
      </Button>
    </>
  );
}
