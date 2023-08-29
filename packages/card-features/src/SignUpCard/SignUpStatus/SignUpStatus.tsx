'use client';

import {Event, Ticket} from '@prisma/client';
import {RouterOutputs} from 'api';
import Link from 'next/link';
import {use} from 'react';
import {type Color, colorVariants} from 'ui';
import {cn} from 'utils';

interface Props {
  mySignUpPromise: Promise<RouterOutputs['event']['getMySignUp']>;
  myTicketPromise: Promise<RouterOutputs['event']['getMyTicketsByEvent']>;
  event: Event & {tickets: Ticket[]};
}

export function SignUpStatusCard({
  children,
  color,
}: {
  children: React.ReactNode;
  color: Color;
}) {
  return (
    <div className="bg-background rounded-b-lg">
      <div
        className={cn(
          'border pt-5 -mt-3 px-6 pb-2 rounded-b-lg',
          colorVariants({intent: color})
        )}
      >
        {children}
      </div>
    </div>
  );
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

  return (
    <SignUpStatusCard
      color={
        amInvited ? 'yellow' : amSignedUp || haveTickets ? 'green' : 'default'
      }
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
      {!amSignedUp && !amInvited && !haveTickets && (
        <span className="text-sm">{"You're not signed up"}</span>
      )}
    </SignUpStatusCard>
  );
}
