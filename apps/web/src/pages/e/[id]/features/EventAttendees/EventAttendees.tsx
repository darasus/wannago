import {EventRegistrationStatus, User} from '@prisma/client';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {Container, CardBase, Button, Text, PageHeader, LoadingBlock} from 'ui';
import {trpc} from 'trpc/src/trpc';
import {saveAs} from 'file-saver';
import {EventRegistrationStatusBadge} from 'ui/src/components/EventRegistrationStatusBadge/EventRegistrationStatusBadge';
import {useConfirmDialog, useEventId} from 'hooks';
import {UserPlusIcon, DocumentArrowDownIcon} from '@heroicons/react/24/solid';
import {useCallback} from 'react';
import {MessageParticipantsButton} from './features/MessageParticipantsButton/MessageParticipantsButton';
import {ExportAttendeesCSV} from './features/ExportAttendeesCSV/ExportAttendeesCSV';

interface ItemProps {
  user: User;
  status: EventRegistrationStatus;
  hasPlusOne: boolean | null;
  refetch: () => void;
}

function Item({user, hasPlusOne, status, refetch}: ItemProps) {
  const label =
    user.firstName +
    ' ' +
    user.lastName +
    ' · ' +
    user.email +
    (hasPlusOne ? ' · +1' : '');

  const {mutateAsync} = trpc.event.cancelEventByUserId.useMutation();
  const {eventShortId} = useEventId();
  const handleCancelClick = useCallback(async () => {
    if (eventShortId) {
      await mutateAsync({eventShortId, userId: user.id}).then(() => refetch());
    }
  }, [mutateAsync, eventShortId, user.id, refetch]);
  const {open, modal} = useConfirmDialog({
    title: 'Cancel RSVP',
    description: `Are you sure you want to cancel the RSVP for ${user.firstName} ${user.lastName}?`,
    onConfirm: handleCancelClick,
  });

  return (
    <>
      {modal}
      <CardBase key={user.id} data-testid="invitee-card">
        <div className="flex items-center">
          <Text>{label}</Text>
          <div className="grow" />
          <EventRegistrationStatusBadge status={status} />
          <Button
            size="sm"
            variant="neutral"
            onClick={open}
            disabled={status === 'CANCELLED'}
          >
            Cancel
          </Button>
        </div>
      </CardBase>
    </>
  );
}

export function EventAttendees() {
  const {eventShortId} = useEventId();
  const {data, refetch, isLoading} = trpc.event.getAttendees.useQuery(
    {
      eventShortId: eventShortId!,
    },
    {
      enabled: !!eventShortId,
    }
  );

  if (isLoading) {
    return <LoadingBlock />;
  }

  return (
    <>
      <Head>
        <title>{`Attendees | WannaGo`}</title>
      </Head>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <MessageParticipantsButton />
          <ExportAttendeesCSV />
        </div>
        {data?.length === 0 && (
          <div className="text-center">
            <Text>No attendees yet...</Text>
          </div>
        )}
        {data?.map(signUp => {
          return (
            <Item
              key={signUp.user.id}
              user={signUp.user}
              hasPlusOne={signUp.hasPlusOne}
              status={signUp.status}
              refetch={refetch}
            />
          );
        })}
      </div>
    </>
  );
}
