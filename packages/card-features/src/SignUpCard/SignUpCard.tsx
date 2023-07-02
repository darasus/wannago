'use client';

import {Event, Ticket} from '@prisma/client';
import {CardBase, Container, Text} from 'ui';
import {FreeEventAction} from './features/FreeEventAction/FreeEventAction';
import {PaidEventAction} from './features/PaidEventAction/PaidEventAction';
import {api} from '../../../../apps/web/src/trpc/client';
import {RouterOutputs} from 'api';
import {Suspense, use} from 'react';

interface Props {
  event: Event & {tickets: Ticket[]};
  myTicketPromise: ReturnType<typeof api.event.getMyTicketsByEvent.query>;
  mePromise: Promise<RouterOutputs['user']['me']>;
}

export function SignUpCard({event, myTicketPromise, mePromise}: Props) {
  const isFreeEvent = event.tickets.length === 0;
  const isPaidEvent = event.tickets.length > 0;

  return (
    <>
      <Container className="w-full p-0 m-0">
        <CardBase>
          <div className="flex items-center gap-x-2">
            <div className="grow">
              <Text className="text-gray-400">
                <Suspense fallback="Loading...">
                  <UserCount eventId={event.id} />
                </Suspense>
              </Text>
            </div>
            <div>
              {isFreeEvent && <FreeEventAction event={event} />}
              {isPaidEvent && (
                <PaidEventAction
                  event={event}
                  myTicketPromise={myTicketPromise}
                  mePromise={mePromise}
                />
              )}
            </div>
          </div>
        </CardBase>
      </Container>
    </>
  );
}

function UserCount({eventId}: {eventId: string}) {
  const attendeeCount = use(
    api.event.getNumberOfAttendees.query({
      eventId,
    })
  );

  return `${attendeeCount?.count ?? 0} attending`;
}
