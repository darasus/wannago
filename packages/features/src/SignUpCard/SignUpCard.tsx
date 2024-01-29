import {Suspense} from 'react';
import {RouterOutputs} from 'api';
import {CardBase, Container, Text} from 'ui';

import {api} from '../../../../apps/web/src/trpc/server-http';

import {FreeEventAction} from './features/FreeEventAction/FreeEventAction';
import {PaidEventAction} from './features/PaidEventAction/PaidEventAction';
import {UserCount} from './features/UserCount/UserCount';

interface Props {
  event: NonNullable<RouterOutputs['event']['getByShortId']>;
  mePromise: Promise<RouterOutputs['user']['me']>;
}

export function SignUpCard({event, mePromise}: Props) {
  const isFreeEvent = event.tickets.length === 0;
  const isPaidEvent = event.tickets.length > 0;

  return (
    <>
      <Container className="w-full p-0 m-0">
        <CardBase>
          <div className="flex items-center gap-x-2">
            <div className="grow">
              <Text>
                <Suspense fallback="Loading...">
                  <UserCount
                    numberOfAttendeesPromise={api.event.getNumberOfAttendees.query(
                      {
                        eventId: event.id,
                      }
                    )}
                  />
                </Suspense>
              </Text>
            </div>
            <div>
              {isFreeEvent && <FreeEventAction event={event} />}
              {isPaidEvent && (
                <PaidEventAction event={event} mePromise={mePromise} />
              )}
            </div>
          </div>
        </CardBase>
      </Container>
    </>
  );
}
