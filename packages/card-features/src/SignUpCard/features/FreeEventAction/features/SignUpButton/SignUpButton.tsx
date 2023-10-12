import {useFormContext} from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Label,
  Switch,
} from 'ui';
import {EventSignUpForm} from '../../types';
import {Event, SignUpProtection} from '@prisma/client';
import {useAttendEvent} from './hooks/useAttendEvent';

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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Attend</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Use sign up code</DialogTitle>
                <DialogDescription>
                  To be able to sign up you need to provide a sign up code that
                  you must obtain from the organizer.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    defaultValue="Pedro Duarte"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Sign up</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </form>
    </Form>
  );
}
