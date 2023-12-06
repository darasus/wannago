'use client';

import {
  Button,
  Counter,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Text,
} from 'ui';
import {Event, Ticket} from '@prisma/client';
import {formatCents} from 'utils';
import {useForm} from 'react-hook-form';
import {useRouter} from 'next/navigation';
import {TRPCClientError} from '@trpc/client';
import {use} from 'react';
import {api} from '../../../../../../../../apps/web/src/trpc/client';
import {toast} from 'sonner';
import {z} from 'zod';
import {RouterOutputs} from 'api';
import Link from 'next/link';
import {formScheme} from '../../validation';
import {zodResolver} from '@hookform/resolvers/zod';

interface Props {
  event: Event & {tickets: Ticket[]};
  isOpen: boolean;
  onClose: () => void;
  mePromise: Promise<RouterOutputs['user']['me']>;
}

export function TicketSelectorModal({
  isOpen,
  onClose,
  event,
  mePromise,
}: Props) {
  const me = use(mePromise);
  const router = useRouter();
  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      tickets: event.tickets.reduce((acc, ticket) => {
        return {...acc, [ticket.id]: 0};
      }, {}),
    },
  });

  const total = Object.entries(form.watch().tickets).reduce(
    (acc: number, [ticketId, quantity]) => {
      if (isNaN(Number(quantity))) {
        return acc;
      }

      const ticket = event.tickets.find((ticket) => ticket.id === ticketId);

      if (!ticket) {
        return acc;
      }

      return Number(quantity) * ticket?.price + acc;
    },
    0
  );

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      if (!me?.id) {
        throw new TRPCClientError('You must be logged in to buy tickets');
      }

      if (Object.values(data.tickets).every((quantity) => quantity === 0)) {
        return toast.error('You must select at least one ticket');
      }

      const responseUrl = await api.payments.createCheckoutSession
        .mutate({
          tickets: Object.entries(data.tickets)
            .filter(([, quantity]) => Boolean(quantity))
            .map(([ticketId, quantity]) => ({
              ticketId,
              quantity: Number(quantity),
            })),
          eventId: event.id,
        })
        .catch((error) => {
          toast.error(error.message);
        });

      if (!responseUrl) {
        return;
      }

      router.push(`/checkout/${responseUrl.checkoutSessionId}`);
    } catch (error) {}
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select ticket and quantity</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              {event.tickets.map(({title, price, id, description}) => {
                return (
                  <FormField
                    key={id}
                    control={form.control}
                    name={`tickets.${id}`}
                    render={({field}) => (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                          <div className="flex grow">
                            <div className="grow">
                              <Text>{title}</Text>
                            </div>
                            <div>
                              <Text>
                                {formatCents(price, event.preferredCurrency)}
                              </Text>
                            </div>
                          </div>
                          <FormItem>
                            <FormControl>
                              <Counter
                                value={field.value}
                                minValue={0}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        </div>
                        {description && (
                          <div className="bg-muted p-2 rounded-xl">
                            <Text>{description}</Text>
                          </div>
                        )}
                        <FormMessage />
                      </div>
                    )}
                  />
                );
              })}
              <div className="flex">
                <div className="grow">
                  <Text>Total:</Text>
                </div>
                <div>
                  <Text className="font-bold">
                    {formatCents(total, event.preferredCurrency)}
                  </Text>
                </div>
              </div>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                isLoading={form.formState.isSubmitting}
                data-testid="buy-tickets-button"
              >
                Buy
              </Button>
            </div>
            <div className="text-center mt-1">
              <span className="text-sm text-gray-400">
                By clicking Buy you agree to{' '}
                <Link
                  href="/terms-of-service"
                  target="_blank"
                  className="underline"
                >
                  terms of service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  className="underline"
                >
                  privacy policy
                </Link>
                .
              </span>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
