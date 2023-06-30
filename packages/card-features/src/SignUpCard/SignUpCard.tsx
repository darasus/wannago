'use client';

import {Event, Ticket} from '@prisma/client';
import {SignUpCard as _SignUpCard} from 'cards';
import {Container} from 'ui';
import {FreeEventAction} from './features/FreeEventAction/FreeEventAction';
import {PaidEventAction} from './features/PaidEventAction/PaidEventAction';
import {api} from '../../../../apps/web/src/trpc/client';
import {use} from 'react';

interface Props {
  event: Event & {tickets: Ticket[]};
}

export function SignUpCard({event}: Props) {
  const attendeeCount = use(
    api.event.getNumberOfAttendees.query({
      eventId: event.id,
    })
  );

  const isFreeEvent = event.tickets.length === 0;
  const isPaidEvent = event.tickets.length > 0;

  return (
    <>
      <Container className="w-full p-0 m-0">
        <_SignUpCard numberOfAttendees={attendeeCount?.count ?? 0}>
          {isFreeEvent && <FreeEventAction event={event} />}
          {isPaidEvent && <PaidEventAction event={event} />}
        </_SignUpCard>
      </Container>
    </>
  );
}
