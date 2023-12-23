'use client';

import {EventRegistrationStatus, User} from '@prisma/client';
import {
  Button,
  CardBase,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Spinner,
} from 'ui';
import {EventRegistrationStatusBadge} from 'ui';
import {MoreHorizontal} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useConfirmDialog} from 'hooks';
import {toast} from 'sonner';
import {api} from '../../../../../../../../../../../trpc/client';

interface UserRowProps {
  user: User & {status: EventRegistrationStatus | null};
  eventShortId: string;
}

export function UserRow({user, eventShortId}: UserRowProps) {
  const {invite, isInviting, modal} = useInvite({
    eventShortId,
    user,
  });

  return (
    <>
      {modal}
      <CardBase
        key={user.id}
        innerClassName="flex flex-col md:flex-row gap-2"
        data-testid="invitee-card"
      >
        <div className="flex items-center grow">
          <div className="inline-block">
            <p className="line-clamp-1">{`${user.firstName} ${user.lastName} · ${user.email}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user.status && <EventRegistrationStatusBadge status={user.status} />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {isInviting ? (
                  <Spinner />
                ) : (
                  <MoreHorizontal className="w-4 h-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    invite();
                  }}
                  disabled={user.status === 'REGISTERED'}
                >
                  Invite
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardBase>
    </>
  );
}

function useInvite({eventShortId, user}: {eventShortId: string; user: User}) {
  const router = useRouter();
  const {open, modal, isPending} = useConfirmDialog({
    title: `Invite ${user.firstName} ${user.lastName}?`,
    description: `Are you sure you want to invite ${user.firstName} ${user.lastName} to the event? We will send invitation to this email address: ${user.email}`,
    onConfirm: async () => {
      await api.event.invitePastAttendee
        .mutate({userId: user.id, eventShortId})
        .then(() => {
          toast.success(`User is successfully invited!`);
          router.refresh();
        })
        .catch((error) => {
          toast.error(error.message);
        });
      toast.success(`User is successfully invited!`);
      // router.refresh();
    },
  });

  return {
    invite: open,
    modal,
    isInviting: isPending,
  };
}
