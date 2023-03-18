import {FormEventHandler} from 'react';
import {useFormContext} from 'react-hook-form';
import {Badge, Button, CardBase, Text, Tooltip} from 'ui';
import {Switch} from '../../../../apps/web/src/components/Input/Switch/Switch';

interface Props {
  onJoinSubmit: FormEventHandler;
  onCancelSubmit: FormEventHandler;
  numberOfAttendees: number;
  isPublished: boolean;
  amSignedUp: boolean;
  isBlur?: boolean;
  isLoading?: boolean;
}

interface EventSignUpForm {
  hasPlusOne: boolean;
}

export function SignUpCard({
  isPublished,
  numberOfAttendees,
  onJoinSubmit,
  onCancelSubmit,
  amSignedUp,
  isLoading,
}: Props) {
  const {
    formState: {defaultValues, isSubmitting},
    control,
  } = useFormContext<EventSignUpForm>();

  const numberOfAttendeesLabel =
    typeof numberOfAttendees === 'number'
      ? `${numberOfAttendees} attending`
      : 'Loading...';

  const tooltipText = isPublished
    ? undefined
    : 'To enable sign-ups, please publish the event first.';

  const action = amSignedUp ? (
    <form className="flex items-center gap-x-4" onSubmit={onCancelSubmit}>
      <div className="flex items-center gap-x-2">
        <Badge
          size="xs"
          color="green"
          data-testid="event-signup-success-label"
        >{`You're signed up!`}</Badge>
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          variant="neutral"
          size="sm"
          data-testid="cancel-signup-button"
        >
          Cancel
        </Button>
      </div>
    </form>
  ) : (
    <form className="flex items-center gap-x-4 w-full" onSubmit={onJoinSubmit}>
      <div>
        <Switch
          name="hasPlusOne"
          control={control}
          defaultValue={defaultValues?.hasPlusOne || false}
        >
          <span>
            <span className="hidden md:inline">Bring </span>+1
          </span>
        </Switch>
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        size="sm"
        data-testid="attend-button"
      >
        Attend
      </Button>
    </form>
  );

  return (
    <Tooltip text={tooltipText}>
      <CardBase isBlur={!isPublished} isLoading={isLoading}>
        <div className="flex items-center gap-x-2">
          <div className="grow">
            <Text className="text-gray-400">{numberOfAttendeesLabel}</Text>
          </div>
          <div className="flex items-center">{action}</div>
        </div>
      </CardBase>
    </Tooltip>
  );
}
