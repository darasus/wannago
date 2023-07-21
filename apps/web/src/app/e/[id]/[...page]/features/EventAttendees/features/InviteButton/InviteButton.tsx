'use client';

import {use} from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Text,
} from 'ui';
import {UserRow} from './features/UserRow/UserRow';
import {RouterOutputs} from 'api';
import {EventInviteButton} from './features/EventInviteButton/EventInviteButton';

interface Props {
  eventShortId: string;
  getAllEventsAttendeesPromise: Promise<
    RouterOutputs['event']['getAllEventsAttendees']
  >;
}

export function InviteButton({
  eventShortId,
  getAllEventsAttendeesPromise,
}: Props) {
  const allEventsAttendees = use(getAllEventsAttendeesPromise);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" data-testid="invite-button">
            Invite
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invite attendees</DialogTitle>
            <DialogDescription>
              {
                'These are attendees from your past events or those who follow you or your organizations.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 w-full">
            <div>
              <EventInviteButton />
            </div>
            {allEventsAttendees?.length === 0 && (
              <div className="text-center">
                <Text>{`You don't have users to invite yet...`}</Text>
              </div>
            )}
            {allEventsAttendees?.map((user) => {
              return (
                <UserRow
                  key={user.id}
                  user={user}
                  eventShortId={eventShortId}
                />
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
