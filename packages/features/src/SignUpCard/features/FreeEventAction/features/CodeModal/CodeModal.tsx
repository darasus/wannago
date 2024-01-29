'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'ui';
import {z} from 'zod';

import {useCodeModalState} from '../../hooks/useCodeModalState';

const validation = z.object({
  code: z.string().min(1),
});

interface Props {
  onComplete: () => void;
}

export function CodeModal({onComplete}: Props) {
  const form = useForm({
    defaultValues: {
      code: '',
    },
    resolver: zodResolver(validation),
  });
  const {isOpen, onOpenChange} = useCodeModalState();
  const onSubmit = form.handleSubmit(async (data) => {
    // validate code
    // onComplete();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[425px]" usePortal={false}>
            <DialogHeader>
              <DialogTitle>Use sign up code</DialogTitle>
              <DialogDescription>
                To be able to sign up you need to provide a sign up code that
                you must obtain from the organizer.
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
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                data-testid="event-code-form-submit"
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
