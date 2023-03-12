import {FormEventHandler} from 'react';
import {useFormContext} from 'react-hook-form';
import {Button, CardBase, Text, Tooltip} from 'ui';
import {Switch} from '../../../../apps/web/src/components/Input/Switch/Switch';

interface Props {
  onSubmit: FormEventHandler;
  numberOfAttendees: number;
  isPublished: boolean;
}

interface EventSignUpForm {
  hasPlusOne: boolean;
}

export function SignUpCard({isPublished, numberOfAttendees, onSubmit}: Props) {
  const {
    register,
    formState: {errors, isSubmitting, defaultValues},
    control,
  } = useFormContext<EventSignUpForm>();

  const numberOfAttendeesLabel =
    typeof numberOfAttendees === 'number'
      ? `${numberOfAttendees} people attending`
      : 'Loading...';

  const tooltipText = isPublished
    ? undefined
    : 'To enable sign-ups, please publish the event first.';

  return (
    <Tooltip text={tooltipText}>
      <CardBase>
        <form onSubmit={onSubmit}>
          <div className="flex items-center">
            <div className="flex items-center grow gap-x-2">
              <Button type="submit">Attend</Button>
              <Switch
                name="hasPlusOne"
                control={control}
                defaultValue={defaultValues?.hasPlusOne || false}
              >
                Bring +1
              </Switch>
            </div>
            <Text className="text-gray-400">{numberOfAttendeesLabel}</Text>
          </div>
        </form>
      </CardBase>
    </Tooltip>
  );
}
