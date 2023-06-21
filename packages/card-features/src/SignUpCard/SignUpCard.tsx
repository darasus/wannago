'use client';

import {Event, Ticket} from '@prisma/client';
import {SignUpCard as _SignUpCard} from 'cards';
import {useAttendeeCount} from 'hooks';
import {Container} from 'ui';
import {FreeEventAction} from './features/FreeEventAction/FreeEventAction';
import {PaidEventAction} from './features/PaidEventAction/PaidEventAction';

interface Props {
  event: Event & {tickets: Ticket[]};
}

export function SignUpCard({event}: Props) {
  const attendeeCount = useAttendeeCount({
    eventId: event.id,
  });

  const isFreeEvent = event.tickets.length === 0;
  const isPaidEvent = event.tickets.length > 0;

  return (
    <>
      <Container className="w-full p-0 m-0">
        <_SignUpCard numberOfAttendees={attendeeCount?.data?.count ?? 0}>
          {isFreeEvent && <FreeEventAction event={event} />}
          {isPaidEvent && <PaidEventAction event={event} />}
        </_SignUpCard>
      </Container>
    </>
  );
}
