import {EventSignUp, Ticket, TicketSale, User} from '@prisma/client';
import Head from 'next/head';
import {CardBase, Button, Text, LoadingBlock, PageHeader} from 'ui';
import {trpc} from 'trpc/src/trpc';
import {EventRegistrationStatusBadge} from 'ui/src/components/EventRegistrationStatusBadge/EventRegistrationStatusBadge';
import {useConfirmDialog, useEventId} from 'hooks';
import {useCallback} from 'react';
import {MessageParticipantsButton} from './features/MessageParticipantsButton/MessageParticipantsButton';
import {ExportAttendeesCSV} from './features/ExportAttendeesCSV/ExportAttendeesCSV';

interface ItemProps {
  eventSignUp: EventSignUp & {
    user: User;
    ticketSales: Array<TicketSale & {ticket: Ticket}>;
  };
  refetch: () => void;
}

function Item({eventSignUp, refetch}: ItemProps) {
  const label =
    eventSignUp.user.firstName +
    ' ' +
    eventSignUp.user.lastName +
    ' · ' +
    eventSignUp.user.email +
    (eventSignUp.hasPlusOne ? ' · +1' : '');

  const {mutateAsync} = trpc.event.cancelEventByUserId.useMutation();
  const {eventShortId} = useEventId();
  const handleCancelClick = useCallback(async () => {
    if (eventShortId) {
      await mutateAsync({eventShortId, userId: eventSignUp.user.id}).then(() =>
        refetch()
      );
    }
  }, [mutateAsync, eventShortId, eventSignUp, refetch]);
  const {open, modal} = useConfirmDialog({
    title: 'Cancel RSVP',
    description: `Are you sure you want to cancel the RSVP for ${eventSignUp.user.firstName} ${eventSignUp.user.lastName}?`,
    onConfirm: handleCancelClick,
  });

  return (
    <>
      {modal}
      <CardBase data-testid="invitee-card">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex items-center truncate grow">
            <Text className="truncate">{label}</Text>
          </div>
          <div className="flex gap-2">
            <EventRegistrationStatusBadge status={eventSignUp.status} />
            {eventSignUp.ticketSales.length === 0 && (
              <Button
                size="sm"
                variant="neutral"
                onClick={open}
                disabled={eventSignUp.status === 'CANCELLED'}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
        {eventSignUp.ticketSales.length > 0 && (
          <>
            {eventSignUp.ticketSales.map(ticketSale => {
              return (
                <div key={ticketSale.id}>
                  <Text>{`Ticket: ${ticketSale.ticket.title} x${ticketSale.quantity}`}</Text>
                </div>
              );
            })}
          </>
        )}
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
        <PageHeader title="Event attendees" />
        <div className="flex gap-2">
          <MessageParticipantsButton />
          <ExportAttendeesCSV />
        </div>
        {data?.length === 0 && (
          <div className="text-center">
            <Text>No attendees yet...</Text>
          </div>
        )}
        {data?.map(eventSignUp => {
          return (
            <Item
              key={eventSignUp.user.id}
              eventSignUp={eventSignUp}
              refetch={refetch}
            />
          );
        })}
      </div>
    </>
  );
}
