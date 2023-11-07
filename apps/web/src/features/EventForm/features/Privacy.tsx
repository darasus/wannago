import {useFormContext} from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Label,
  Input,
  RadioGroup,
  RadioGroupItem,
  Button,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from 'ui';
import {z} from 'zod';
import {eventFormSchema} from '../hooks/useEventForm';
import {EventVisibility, SignUpProtection} from '@prisma/client';
import {
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  LockKeyholeIcon,
  UnlockKeyholeIcon,
} from 'lucide-react';
import {proseClassName} from 'const';
import {cn} from 'utils';

export function Privacy() {
  const form = useFormContext<z.infer<typeof eventFormSchema>>();
  const isEventVisibilityProtected =
    form.watch('eventVisibility') === EventVisibility.PROTECTED;
  const isEventSignUpProtected =
    form.watch('signUpProtection') === SignUpProtection.PROTECTED;

  return (
    <>
      <FormField
        control={form.control}
        name="eventVisibility"
        render={({field}) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Event visibility{' '}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="p-1 w-auto h-auto"
                      type="button"
                    >
                      <InfoIcon className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <div className={cn(proseClassName, 'text-xs')}>
                      <h3>Event visibility</h3>
                      <p>
                        Event visibility settings allow you to fine tune who can
                        see event details. You can set following options:
                      </p>
                      <ul>
                        <li>
                          Public: anyone who can access event link can read
                          event details
                        </li>
                        <li>
                          Private: anyone who has access to special code can
                          read event details
                        </li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                className="grid grid-cols-2 gap-4"
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                <Label
                  htmlFor="event-visibility-public"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <RadioGroupItem
                    value={EventVisibility.PUBLIC}
                    id="event-visibility-public"
                    className="sr-only"
                  />
                  <EyeIcon className="mb-2 h-6 w-6" />
                  Public
                </Label>
                <Label
                  htmlFor="event-visibility-protected"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <RadioGroupItem
                    value={EventVisibility.PROTECTED}
                    id="event-visibility-protected"
                    className="sr-only"
                  />
                  <EyeOffIcon className="mb-2 h-6 w-6" />
                  Private
                </Label>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {isEventVisibilityProtected && (
        <FormField
          control={form.control}
          name="eventVisibilityCode"
          render={({field}) => (
            <FormItem>
              <FormLabel>Event visibility code</FormLabel>
              <FormControl>
                <Input
                  data-testid="event-visibility-switch-input"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={form.control}
        name="signUpProtection"
        render={({field}) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Protected sign ups{' '}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="p-1 w-auto h-auto"
                      type="button"
                    >
                      <InfoIcon className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <div className={cn(proseClassName, 'text-xs')}>
                      <h3>Protected sign ups</h3>
                      <p>
                        Event visibility settings allow you to fine tune who can
                        see event details. You can set following options:
                      </p>
                      <ul>
                        <li>
                          Public: anyone who can access event link can read
                          event details
                        </li>
                        <li>
                          Private: anyone who has access to special code can
                          read event details
                        </li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="sign-up-protection-public"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem
                    value={SignUpProtection.PUBLIC}
                    id="sign-up-protection-public"
                    className="sr-only"
                  />
                  <UnlockKeyholeIcon className="mb-2 h-6 w-6" />
                  Sign up without code
                </Label>
                <Label
                  htmlFor="sign-up-protection-protected"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem
                    value={SignUpProtection.PROTECTED}
                    id="sign-up-protection-protected"
                    className="sr-only"
                  />
                  <LockKeyholeIcon className="mb-2 h-6 w-6" />
                  Sign up with code
                </Label>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {isEventSignUpProtected && (
        <FormField
          control={form.control}
          name="signUpProtectionCode"
          render={({field}) => (
            <FormItem>
              <FormLabel>Event sign up protection code</FormLabel>
              <FormControl>
                <Input
                  data-testid="event-sign-up-protection-switch-input"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
