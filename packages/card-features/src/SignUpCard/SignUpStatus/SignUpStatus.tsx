'use client';

import {Event, Ticket} from '@prisma/client';
import {RouterOutputs} from 'api';
import Link from 'next/link';
import {use} from 'react';
import {cn} from 'utils';

interface Props {
  mySignUpPromise: Promise<RouterOutputs['event']['getMySignUp']>;
  myTicketPromise: Promise<RouterOutputs['event']['getMyTicketsByEvent']>;
  event: Event & {tickets: Ticket[]};
}

export function SignUpStatus({mySignUpPromise, myTicketPromise, event}: Props) {
  const signUp = use(mySignUpPromise);
  const myTickets = use(myTicketPromise);
  const haveTickets =
    event.tickets.length > 0 && myTickets && myTickets?.length > 0;
  const amSignedUp =
    !haveTickets && Boolean(signUp && signUp?.status === 'REGISTERED');
  const amInvited =
    !haveTickets && Boolean(signUp && signUp?.status === 'INVITED');

  if (!amSignedUp && !amInvited && !haveTickets) {
    return null;
  }

  return (
    <div className="bg-background rounded-b-lg">
      <div
        className={cn('border pt-5 -mt-3 px-6 pb-2 rounded-b-lg', {
          'bg-yellow-300 border-yellow-600': amInvited,
          'bg-green-400/20 border-green-600/20': amSignedUp || haveTickets,
        })}
      >
        {amInvited && <span className="text-sm">{"You're invited!"}</span>}
        {amSignedUp && (
          <span className="text-sm" data-testid="event-signup-label">
            {"You're signed up!"}
          </span>
        )}
        {haveTickets && (
          <div className="flex gap-2">
            <span className="text-sm">{'You bought tickets!'}</span>
            <Link
              href={`/e/${event.shortId}/my-tickets`}
              className="text-sm underline font-bold"
            >{`My tickets`}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
