import {router, publicProcedure} from '../trpcServer';
import {
  handleCustomerSubscriptionCreatedInputSchema,
  handleCustomerSubscriptionUpdatedInputSchema,
  handleCustomerSubscriptionDeletedInputSchema,
} from 'stripe-webhook-input-validation';
import * as s from 'stripe';
import {invariant} from 'utils';
import {userNotFoundError} from 'error';

const handleCustomerSubscriptionCreated = publicProcedure
  .input(handleCustomerSubscriptionCreatedInputSchema)
  .query(async ({ctx, input}) => {
    return {success: true};
  });

const handleCustomerSubscriptionUpdated = publicProcedure
  .input(handleCustomerSubscriptionUpdatedInputSchema)
  .query(async ({ctx, input}) => {
    const customer = (await ctx.stripe.stripe.customers.retrieve(
      input.data.object.customer
    )) as s.Stripe.Customer;

    invariant(customer.email, 'Customer email is required');

    const user = await ctx.prisma.user.findFirst({
      where: {
        email: customer.email,
      },
    });

    invariant(user, userNotFoundError);

    if (input.data.object.status === 'active' && !user.subscriptionId) {
      await ctx.prisma.subscription.create({
        data: {
          type: 'PRO',
          user: {
            connect: {
              email: customer.email,
            },
          },
        },
      });
    }

    return {success: true};
  });

const handleCustomerSubscriptionDeleted = publicProcedure
  .input(handleCustomerSubscriptionDeletedInputSchema)
  .query(async ({ctx, input}) => {
    const customer = (await ctx.stripe.stripe.customers.retrieve(
      input.data.object.customer
    )) as s.Stripe.Customer;

    invariant(customer.email, 'Customer email is required');

    const user = await ctx.prisma.user.findFirst({
      where: {
        email: customer.email,
      },
    });

    invariant(user, userNotFoundError);

    if (input.data.object.status === 'canceled' && user.subscriptionId) {
      await ctx.prisma.subscription.delete({
        where: {
          id: user.subscriptionId,
        },
      });
    }

    return {success: true};
  });

export const stripeWebhookHandlerRouter = router({
  handleCustomerSubscriptionCreated,
  handleCustomerSubscriptionUpdated,
  handleCustomerSubscriptionDeleted,
});
