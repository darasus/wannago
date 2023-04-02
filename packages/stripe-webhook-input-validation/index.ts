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
]);

const planSchema = z.object({
  id: z.string(),
});

export const handleCustomerSubscriptionUpdatedInputSchema =
  baseEventHandlerSchema.extend({
    data: z.object({
      object: z.object({
        status: statusSchema,
        plan: planSchema,
        customer: z.string(),
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
