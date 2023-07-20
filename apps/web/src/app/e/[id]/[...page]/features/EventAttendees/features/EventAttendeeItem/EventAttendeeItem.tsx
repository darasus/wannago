'use client';

import {useConfirmDialog} from 'hooks';
import {useParams} from 'next/navigation';
import {useCallback} from 'react';
import {Button, CardBase, EventRegistrationStatusBadge, Text} from 'ui';
import {TicketList} from '../../../TicketList/TicketList';
import {RouterOutputs} from 'api';
import {cancelEventByUserId} from './actions';

interface ItemProps {
  eventSignUp: RouterOutputs['event']['getAttendees'][0];
}

export function EventAttendeeItem({eventSignUp}: ItemProps) {
  const label =
    eventSignUp.user.firstName +
    ' ' +
    eventSignUp.user.lastName +
    (eventSignUp.hasPlusOne ? ' · +1' : '');
  const params = useParams();
  const eventShortId = params?.id as string;
  const handleCancelClick = useCallback(async () => {
    if (eventShortId) {
      await cancelEventByUserId({
        eventShortId,
        userId: eventSignUp.user.id,
      });
    }
  }, [eventShortId, eventSignUp]);
  const {open, modal} = useConfirmDialog({
    title: 'Cancel RSVP',
    description: `Are you sure you want to cancel the RSVP for ${eventSignUp.user.firstName} ${eventSignUp.user.lastName}?`,
    onConfirm: handleCancelClick,
  });

  return (
    <>
      {modal}
      <CardBase data-testid="invitee-card" innerClassName="flex flex-col gap-2">
        <div className="flex items-center flex-col md:flex-row gap-2">
          <div className="flex truncate grow">
            <Text className="truncate">{label}</Text>
          </div>
          <div className="flex items-center gap-2">
            <EventRegistrationStatusBadge status={eventSignUp.status} />
            {Object.entries(eventSignUp.ticketSales).length === 0 && (
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
        {Object.entries(eventSignUp.ticketSales).length > 0 && (
          <div className="p-4 rounded-md border-2">
            <TicketList eventSignUps={[eventSignUp]} />
          </div>
        )}
      </CardBase>
    </>
  );
}
