'use client';

import {use} from 'react';
import {RouterOutputs} from 'api';

interface Props {
  numberOfAttendeesPromise: Promise<
    RouterOutputs['event']['getNumberOfAttendees']
  >;
}

export function UserCount({numberOfAttendeesPromise}: Props) {
  const attendeeCount = use(numberOfAttendeesPromise);

  return `${attendeeCount?.count ?? 0} attending`;
}
