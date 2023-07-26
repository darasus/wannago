'use client';

import {User} from '@prisma/client';
import {useRouter} from 'next/navigation';
import {Button} from 'ui';
import {toast} from 'sonner';
import {useConfirmDialog} from 'hooks';
import {api} from '../../../../../../../../../../trpc/client';

interface InviteButtonProps {
  eventShortId: string;
  user: User;
  disabled?: boolean;
}

export function InviteButton({
  user,
  eventShortId,
  disabled,
}: InviteButtonProps) {
  const router = useRouter();
  const {open, modal, isPending} = useConfirmDialog({
    title: `Invite ${user.firstName} ${user.lastName}?`,
    description: `Are you sure you want to invite ${user.firstName} ${user.lastName} to the event? We will send invitation to this email address: ${user.email}`,
    onConfirm: async () => {
      await api.event.invitePastAttendee
        .mutate({userId: user.id, eventShortId})
        .catch((error) => {
          toast.error(error.message);
        });
      toast.success(`User is successfully invited!`);
      router.refresh();
    },
  });

  return (
    <>
      {modal}
      <Button
        onClick={open}
        size="sm"
        disabled={disabled || isPending}
        isLoading={isPending}
        data-testid="invite-by-email-button"
      >
        Invite
      </Button>
    </>
  );
}
