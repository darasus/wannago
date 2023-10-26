'use client';

import {useForm} from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'ui';

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
}

export function SignUpCodeModal({isOpen, onOpenChange}: Props) {
  const form = useForm();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button type="button" disabled={form.formState.isSubmitting}>
            Attend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
