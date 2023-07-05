'use client';

import {EventSignUp, User} from '@prisma/client';
import {
  CardBase,
  Button,
  Text,
  PageHeader,
  TicketList,
  EventRegistrationStatusBadge,
} from 'ui';
import {useConfirmDialog} from 'hooks';
import {use, useCallback} from 'react';
import {MessageParticipantsButton} from './features/MessageParticipantsButton/MessageParticipantsButton';
import {ExportAttendeesCSV} from './features/ExportAttendeesCSV/ExportAttendeesCSV';
import {useParams} from 'next/navigation';
import {api} from '../../../../../../trpc/client';
import {useRouter} from 'next/navigation';

interface ItemProps {
  eventSignUp: EventSignUp & {
    user: User;
    tickets: {
      [id: string]: {
        id: string;
        title: string;
        description: string | undefined | null;
        quantity: number;
      };
    };
  };
  refetch: () => void;
}

function Item({eventSignUp, refetch}: ItemProps) {
  const label =
    eventSignUp.user.firstName +
    ' ' +
    eventSignUp.user.lastName +
    (eventSignUp.hasPlusOne ? ' · +1' : '');
  const params = useParams();
  const eventShortId = params?.id as string;
  const handleCancelClick = useCallback(async () => {
    if (eventShortId) {
      await api.event.cancelEventByUserId
        .mutate({eventShortId, userId: eventSignUp.user.id})
        .then(() => refetch());
    }
  }, [eventShortId, eventSignUp, refetch]);
  const {open, modal} = useConfirmDialog({
    title: 'Cancel RSVP',
    description: `Are you sure you want to cancel the RSVP for ${eventSignUp.user.firstName} ${eventSignUp.user.lastName}?`,
    onConfirm: handleCancelClick,
  });

  return (
    <>
      {modal}
      <CardBase data-testid="invitee-card" innerClassName="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex items-center truncate grow">
            <Text className="truncate">{label}</Text>
          </div>
          <div className="flex gap-2">
            <EventRegistrationStatusBadge status={eventSignUp.status} />
            {Object.entries(eventSignUp.tickets).length === 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={open}
                disabled={eventSignUp.status === 'CANCELLED'}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
        {Object.entries(eventSignUp.tickets).length > 0 && (
          <div className="p-4 rounded-3xl border-2">
            <TicketList tickets={Object.values(eventSignUp.tickets)} />
          </div>
        )}
      </CardBase>
    </>
  );
}

export const metadata = {
  title: 'Attendees | WannaGo',
};

export function EventAttendees() {
  const router = useRouter();
  const params = useParams();
  const eventShortId = params?.id as string;
  const attendees = use(
    api.event.getAttendees.query({
      eventShortId: eventShortId,
    })
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <PageHeader title="Event attendees" />
        <div className="flex gap-2">
          <MessageParticipantsButton />
          <ExportAttendeesCSV />
        </div>
        {attendees?.length === 0 && (
          <div className="text-center">
            <Text>No attendees yet...</Text>
          </div>
        )}
        {attendees?.map((eventSignUp) => {
          return (
            <Item
              key={eventSignUp.user.id}
              eventSignUp={eventSignUp}
              refetch={router.refresh}
            />
          );
        })}
      </div>
    </>
  );
}
