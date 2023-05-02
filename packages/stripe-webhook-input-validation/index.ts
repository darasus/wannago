import {z} from 'zod';

export const baseEventHandlerSchema = z
  .object({
    type: z.string(),
    // type: z.enum([
    //   'payment_intent.created',
    //   'payment_intent.succeeded',

    //   'customer.created',
    //   'customer.updated',
    //   'customer.subscription.created',
    //   'customer.subscription.updated',
    //   'customer.subscription.deleted',

    //   'checkout.session.completed',

    //   'charge.succeeded',

    //   'payment_method.attached',

    //   'invoice.created',
    //   'invoice.finalized',
    //   'invoice.updated',
    //   'invoice.paid',
    //   'invoice.payment_succeeded',

    //   'billing_portal.session.created',
    // ]),
  })
  .passthrough();

export const handleCustomerSubscriptionCreatedInputSchema =
  baseEventHandlerSchema.extend({});

const statusSchema = z.enum([
  'incomplete',
  'incomplete_expired',
  'trailing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'complete',
]);

const planSchema = z.object({
  id: z.string(),
});

export const handleCustomerSubscriptionUpdatedInputSchema =
  baseEventHandlerSchema.extend({
    data: z.object({
      object: z.object({
        cancel_at: z.number().optional().nullable(),
        cancellation_details: z
          .object({
            reason: z.string().optional().nullable(), //'cancellation_requested',
          })
          .optional(),
        status: statusSchema,
        plan: planSchema,
        customer: z.string(),
      }),
    }),
  });

export const handleCheckoutSessionCompletedInputSchema =
  baseEventHandlerSchema.extend({
    data: z.object({
      object: z.object({
        mode: z.enum(['subscription', 'payment']),
        customer: z.string(),
        status: statusSchema,
        metadata: z.object({
          eventId: z.string().uuid(),
          externalUserId: z.string(),
          tickets: z.string(),
        }),
      }),
    }),
  });

export const handleCustomerSubscriptionDeletedInputSchema =
  baseEventHandlerSchema.extend({
    data: z.object({
      object: z.object({
        status: statusSchema,
        plan: planSchema,
        customer: z.string(),
      }),
    }),
  });
