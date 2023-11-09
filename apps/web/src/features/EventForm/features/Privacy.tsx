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
import {EventVisibility, Listing, SignUpProtection} from '@prisma/client';
import {
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  ListPlusIcon,
  ListXIcon,
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
                  data-testid="event-visibility-public-button"
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
                  data-testid="event-visibility-protected-button"
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
                  data-testid="event-visibility-protected-code-input"
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
                        Event sign up protection settings allow you to fine tune
                        who can sign up to your event. You can set following
                        options:
                      </p>
                      <ul>
                        <li>
                          Public sign up: anyone who can access event link can
                          sign up to your event
                        </li>
                        <li>
                          Sign up with code: anyone who has access to special
                          code can sign up to your event
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
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                  data-testid="event-sign-up-protection-public-button"
                >
                  <RadioGroupItem
                    value={SignUpProtection.PUBLIC}
                    id="sign-up-protection-public"
                    className="sr-only"
                  />
                  <UnlockKeyholeIcon className="mb-2 h-6 w-6" />
                  Public sign up
                </Label>
                <Label
                  htmlFor="sign-up-protection-protected"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                  data-testid="event-sign-up-protection-protected-button"
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
                  data-testid="event-sign-up-protection-protected-code-input"
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
        name="listing"
        render={({field}) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Listing{' '}
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
                      <h3>Listing</h3>
                      <p>
                        Event listing settings allow you to fine tune if your
                        event can be seen on your profile page. You can set
                        following options:
                      </p>
                      <ul>
                        <li>
                          Listed: anyone who can see your event on your profile
                          page
                        </li>
                        <li>
                          Unlisted: no one can see your event on your profile
                          page. Only users with event link can view your event.
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
                  htmlFor="listing-listed"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                  data-testid="event-listing-listed-button"
                >
                  <RadioGroupItem
                    value={Listing.LISTED}
                    id="listing-listed"
                    className="sr-only"
                  />
                  <ListPlusIcon className="mb-2 h-6 w-6" />
                  Listed
                </Label>
                <Label
                  htmlFor="listing-unlisted"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                  data-testid="event-listing-unlisted-button"
                >
                  <RadioGroupItem
                    value={Listing.UNLISTED}
                    id="listing-unlisted"
                    className="sr-only"
                  />
                  <ListXIcon className="mb-2 h-6 w-6" />
                  Unlisted
                </Label>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
