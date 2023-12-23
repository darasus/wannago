import {DotsHorizontalIcon} from '@radix-ui/react-icons';
import {useCallback} from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui';
import {api} from '../../../../../../../../../../../trpc/client';
import {toast} from 'sonner';
import {useConfirmDialog} from 'hooks';
import {EventRegistrationStatus} from '@prisma/client';
import {revalidateGetAttendees} from '../../../../../../../../../../../actions';

interface Props {
  userId: string;
  eventShortId: string;
  fullName: string;
  status: EventRegistrationStatus;
}

export function ActionsButton({userId, eventShortId, fullName, status}: Props) {
  const handleCancelClick = useCallback(async () => {
    if (eventShortId) {
      await api.event.cancelEventByUserId
        .mutate({
          eventShortId,
          userId,
        })
        .then(async () => {
          await revalidateGetAttendees({eventShortId});
          toast.success('RSVP cancelled!');
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  }, [eventShortId, userId]);

  const {open, modal} = useConfirmDialog({
    title: 'Cancel sign up?',
    description: `Are you sure you want to cancel sign up for ${fullName}?`,
    onConfirm: handleCancelClick,
  });

  return (
    <>
      {modal}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={status === 'CANCELLED'} onClick={open}>
            Cancel sign up
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
