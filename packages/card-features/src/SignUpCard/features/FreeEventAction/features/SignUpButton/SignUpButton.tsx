import {FormProvider, useFormContext} from 'react-hook-form';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Switch,
} from 'ui';
import {EventSignUpForm} from '../../types';
import {Event, SignUpProtection} from '@prisma/client';
import {useAttendEvent} from './hooks/useAttendEvent';
import {ProtectedSignUpButton} from './ProtectedSignUpButton/ProtectedSignUpButton';

interface Props {
  event: Event & {isPast: boolean};
}

export function SignUpButton({event}: Props) {
  const form = useFormContext<EventSignUpForm>();
  const {attendEvent} = useAttendEvent({event});
  const onJoinSubmit = form.handleSubmit(attendEvent);
  const isEventSignUpPublic =
    event.signUpProtection === SignUpProtection.PUBLIC;
  const isEventSignUpProtected =
    event.signUpProtection === SignUpProtection.PROTECTED;

  return (
    <Form {...form}>
      <form
        className="flex items-center gap-x-4 w-full"
        onSubmit={onJoinSubmit}
      >
        <div>
          <FormField
            name="hasPlusOne"
            control={form.control}
            render={({field}) => {
              return (
                <FormItem className="flex items-center space-y-0 gap-1">
                  <FormControl>
                    <Switch
                      id="bring-one"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel htmlFor="bring-one">
                    <span className="hidden md:inline">Bring </span>+1
                  </FormLabel>
                </FormItem>
              );
            }}
          />
        </div>
        {isEventSignUpPublic && (
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || event.isPast}
            isLoading={form.formState.isSubmitting}
            size="sm"
            data-testid="attend-button"
          >
            Attend
          </Button>
        )}
        {isEventSignUpProtected && (
          <FormProvider {...form}>
            <ProtectedSignUpButton />
          </FormProvider>
        )}
      </form>
    </Form>
  );
}
