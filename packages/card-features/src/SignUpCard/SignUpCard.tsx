import {CardBase, Container, Text} from 'ui';
import {FreeEventAction} from './features/FreeEventAction/FreeEventAction';
import {PaidEventAction} from './features/PaidEventAction/PaidEventAction';
import {api} from '../../../../apps/web/src/trpc/server-http';
import {RouterOutputs} from 'api';
import {Suspense} from 'react';
import {UserCount} from './features/UserCount/UserCount';
import {SignUpStatus} from './SignUpStatus/SignUpStatus';

interface Props {
  event:
    | NonNullable<RouterOutputs['event']['getByShortId']>
    | NonNullable<RouterOutputs['event']['getRandomExample']>;
  myTicketPromise: ReturnType<typeof api.event.getMyTicketsByEvent.query>;
  mePromise: Promise<RouterOutputs['user']['me']>;
}

export function SignUpCard({event, myTicketPromise, mePromise}: Props) {
  const isFreeEvent = event.tickets.length === 0;
  const isPaidEvent = event.tickets.length > 0;
  const mySignUpPromise = api.event.getMySignUp.query({eventId: event.id});
  const numberOfAttendeesPromise = api.event.getNumberOfAttendees.query({
    eventId: event.id,
  });

  return (
    <>
      <Container className="w-full p-0 m-0">
        <CardBase>
          <div className="flex items-center gap-x-2">
            <div className="grow">
              <Text>
                <Suspense fallback="Loading...">
                  <UserCount
                    numberOfAttendeesPromise={numberOfAttendeesPromise}
                  />
                </Suspense>
              </Text>
            </div>
            <div>
              {isFreeEvent && (
                <FreeEventAction
                  mySignUpPromise={mySignUpPromise}
                  event={event}
                />
              )}
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
        <Suspense>
          <SignUpStatus
            event={event}
            mySignUpPromise={mySignUpPromise}
            myTicketPromise={myTicketPromise}
          />
        </Suspense>
      </Container>
    </>
  );
}
