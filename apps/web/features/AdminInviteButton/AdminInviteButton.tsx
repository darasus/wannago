import {useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {Button} from '../../components/Button/Button';
import {Modal} from '../../components/Modal/Modal';
import {JoinForm} from '../../components/JoinForm/JoinForm';
import {JoinForm as JoinFormType} from '../../types/forms';
import {trpc} from '../../utils/trpc';
import {useEventId} from '../../hooks/useEventId';
import {toast} from 'react-hot-toast';

interface Props {
  refetch: () => Promise<any>;
}

export function AdminInviteButton({refetch}: Props) {
  const eventId = useEventId();
  const [on, set] = useState(false);
  const form = useForm<JoinFormType>();
  const {mutateAsync} = trpc.event.inviteByEmail.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success('Invitation sent!');
    },
  });

  const onSubmit = form.handleSubmit(async data => {
    await mutateAsync({...data, eventId});
    await refetch();
    form.reset();
  });

  return (
    <>
      <Modal title="Invite by email" isOpen={on} onClose={() => set(false)}>
        <FormProvider {...form}>
          <JoinForm onSubmit={onSubmit} />
        </FormProvider>
      </Modal>
      <Button size="sm" variant="neutral" onClick={() => set(true)}>
        Invite by email
      </Button>
    </>
  );
}
