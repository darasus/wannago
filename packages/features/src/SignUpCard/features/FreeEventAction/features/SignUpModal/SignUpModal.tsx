'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Event} from '@prisma/client';
import {
  Button,
  Dialog,
  DialogContent,
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
  Switch,
} from 'ui';
import {z} from 'zod';

import {useSignUpModalState} from '../../hooks/useSignUpModalState';

const validation = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  hasPlusOne: z.boolean(),
});

interface Props {
  event: Event;
  onComplete: () => void;
}

export function SignUpModal({onComplete, event}: Props) {
  const form = useForm<z.infer<typeof validation>>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      hasPlusOne: false,
    },
    resolver: zodResolver(validation),
  });
  const {isOpen, onOpenChange} = useSignUpModalState();
  const onSubmit = form.handleSubmit(async (data) => {
    // validate code
    onComplete();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[425px]" usePortal={false}>
            <DialogHeader>
              <DialogTitle>{`Attend ${event.title}`}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
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
              <FormField
                control={form.control}
                name="lastName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
              <FormField
                control={form.control}
                name="hasPlusOne"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Bring +1</FormLabel>
                    <FormControl>
                      <div>
                        <Switch
                          id="bring-one"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                data-testid="event-code-form-submit"
                className="w-full"
              >
                Join
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
