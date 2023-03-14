import {FormEventHandler} from 'react';
import {useFormContext} from 'react-hook-form';
import {Button, CardBase, Text, Tooltip} from 'ui';
import {Switch} from '../../../../apps/web/src/components/Input/Switch/Switch';

interface Props {
  onJoinSubmit: FormEventHandler;
  onCancelSubmit: FormEventHandler;
  numberOfAttendees: number;
  isPublished: boolean;
  amSignedUp: boolean;
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
      <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
        Cancel
      </Button>
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
      <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
        Attend
      </Button>
    </form>
  );

  return (
    <Tooltip text={tooltipText}>
      <CardBase>
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
