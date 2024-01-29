'use client';

import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
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

import {api} from '../../../../../../../../apps/web/src/trpc/client';
import {useModalState} from '../../hooks/useModalState';

interface Props {
  isOpen: boolean;
  onOpenChange: (boolean: boolean) => void;
  eventShortId: string;
}

export function SignUpCodeModal({isOpen, onOpenChange, eventShortId}: Props) {
  const {closeSignUpCodeModal, openTicketSelectorUpModal} = useModalState();
  const form = useForm({
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await api.event.validateSignUpProtectionCode
      .query({
        code: data.code,
        id: eventShortId,
      })
      .then((result) => {
        if (result) {
          closeSignUpCodeModal();
          openTicketSelectorUpModal();
        } else {
          toast.error('Code is not valid');
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
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
                Attend
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
