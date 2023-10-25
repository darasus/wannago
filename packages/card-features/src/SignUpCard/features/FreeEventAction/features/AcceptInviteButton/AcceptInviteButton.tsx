'use client';

import {useFormContext} from 'react-hook-form';
import {Badge, Button, Form} from 'ui';
import {EventSignUpForm} from '../../types';
import {useAttendEvent} from '../SignUpButton/hooks/useAttendEvent';
import {Event} from '@prisma/client';

interface Props {
  event: Event & {isPast: boolean};
}

export function AcceptInviteButton({event}: Props) {
  const form = useFormContext<EventSignUpForm>();
  const {attendEvent} = useAttendEvent({event});
  const onJoinSubmit = form.handleSubmit(attendEvent);

  return (
    <Form {...form}>
      <form className="flex items-center gap-x-4" onSubmit={onJoinSubmit}>
        <div className="flex items-center gap-x-2">
          <Badge
            variant={'outline'}
            data-testid="event-signup-success-label"
          >{`You're invited!`}</Badge>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            variant="outline"
            size="sm"
            data-testid="accept-invite-button"
          >
            Accept invite
          </Button>
        </div>
      </form>
    </Form>
  );
}
