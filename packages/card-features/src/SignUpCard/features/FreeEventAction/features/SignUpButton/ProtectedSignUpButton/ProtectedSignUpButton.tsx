'use client';

import {LockIcon} from 'lucide-react';
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'ui';
import {EventSignUpForm} from '../../../types';
import {useCodeModalState} from '../hooks/useCodeModalState';

export function ProtectedSignUpButton() {
  const form = useFormContext<EventSignUpForm>();
  const {isOpen, onOpenChange} = useCodeModalState();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button">
          <LockIcon className="w-4 h-4 mr-2" /> Attend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" usePortal={false}>
        <DialogHeader>
          <DialogTitle>Use sign up code</DialogTitle>
          <DialogDescription>
            To be able to sign up you need to provide a sign up code that you
            must obtain from the organizer.
          </DialogDescription>
        </DialogHeader>
        <FormField
          control={form.control}
          name="code"
          render={({field}) => (
            <FormItem>
              <FormLabel>Enter code</FormLabel>
              <FormControl>
                <Input
                  data-testid="event-code-input"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Attend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
