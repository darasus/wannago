'use client';

import {EventRegistrationStatus, User} from '@prisma/client';
import Head from 'next/head';
import {useParams, useRouter} from 'next/navigation';
import {Button, CardBase, PageHeader, Text} from 'ui';
import {toast} from 'react-hot-toast';
import {EventRegistrationStatusBadge} from 'ui/src/components/EventRegistrationStatusBadge/EventRegistrationStatusBadge';
import {useConfirmDialog} from 'hooks';
import {EventInviteButton} from './features/EventInviteButton/EventInviteButton';
import {api} from '../../../../../../trpc/client';
import {use} from 'react';

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
        .catch(error => {
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
        isLoading={isPending}
        onClick={open}
        variant="neutral"
        size="sm"
        disabled={disabled}
        data-testid="invite-by-email-button"
      >
        Invite
      </Button>
    </>
  );
}

interface UserRowProps {
  user: User & {status: EventRegistrationStatus | null};
  eventShortId: string;
}

function UserRow({user, eventShortId}: UserRowProps) {
  return (
    <>
      <CardBase
        key={user.id}
        innerClassName="flex flex-col md:flex-row gap-2"
        data-testid="invitee-card"
      >
        <div className="flex items-center truncate grow">
          <Text className="truncate">{`${user.firstName} ${user.lastName} · ${user.email}`}</Text>
        </div>
        <div className="flex gap-2">
          {user.status && <EventRegistrationStatusBadge status={user.status} />}
          <InviteButton
            user={user}
            eventShortId={eventShortId}
            disabled={user.status !== null}
          />
        </div>
      </CardBase>
    </>
  );
}

export function EventInvite() {
  const params = useParams();
  const eventShortId = params?.id as string;
  const allAttendees = use(
    api.event.getAllEventsAttendees.query({
      eventShortId: eventShortId,
    })
  );

  return (
    <>
      <Head>
        <title>{`Attendees | WannaGo`}</title>
      </Head>
      <div className="flex flex-col gap-y-4">
        <PageHeader title="Invite attendees" />
        <div>
          <EventInviteButton />
        </div>
        {allAttendees?.length === 0 && (
          <div className="text-center">
            <Text>{`You don't have users to invite yet...`}</Text>
          </div>
        )}
        {allAttendees?.map(user => {
          return (
            <UserRow key={user.id} user={user} eventShortId={eventShortId} />
          );
        })}
      </div>
    </>
  );
}
