import {router, publicProcedure} from '../trpcServer';
import {
  handleCustomerSubscriptionCreatedInputSchema,
  handleCustomerSubscriptionUpdatedInputSchema,
  handleCustomerSubscriptionDeletedInputSchema,
} from 'stripe-webhook-input-validation';
import * as s from 'stripe';
import {invariant, isOrganization, isUser} from 'utils';
import {organizerNotFoundError} from 'error';

const handleCustomerSubscriptionCreated = publicProcedure
  .input(handleCustomerSubscriptionCreatedInputSchema)
  .query(async ({ctx, input}) => {
    return {success: true};
  });

const handleCustomerSubscriptionUpdated = publicProcedure
  .input(handleCustomerSubscriptionUpdatedInputSchema)
  .query(async ({ctx, input}) => {
    if (input.data.object.status !== 'active') return {success: true};

    const customer = (await ctx.stripe.stripe.customers.retrieve(
      input.data.object.customer
    )) as s.Stripe.Customer;

    invariant(customer.email, 'Customer email is required');

    const organizer = await ctx.actions.getOrganizerByEmail({
      email: customer.email,
    });

    invariant(organizer, organizerNotFoundError);

    if (!organizer.subscriptionId) {
      const data = {stripeCustomerId: customer.id};

      if (isUser(organizer)) {
        await ctx.prisma.user.update({
          where: {
            id: organizer.id,
          },
          data,
        });
      }
      if (isOrganization(organizer)) {
        await ctx.prisma.organization.update({
          where: {
            id: organizer.id,
          },
          data,
        });
      }
    }

    await ctx.prisma.subscription.create({
      data: {
        type: isUser(organizer) ? 'PRO' : 'BUSINESS',
        ...(isUser(organizer)
          ? {
              user: {
                connect: {
                  id: organizer.id,
                },
              },
            }
          : {}),
        ...(isOrganization(organizer)
          ? {
              organization: {
                connect: {
                  id: organizer.id,
                },
              },
            }
          : {}),
      },
    });

    return {success: true};
  });

const handleCustomerSubscriptionDeleted = publicProcedure
  .input(handleCustomerSubscriptionDeletedInputSchema)
  .query(async ({ctx, input}) => {
    if (input.data.object.status !== 'canceled') return {success: true};

    const customer = (await ctx.stripe.stripe.customers.retrieve(
      input.data.object.customer
    )) as s.Stripe.Customer;

    invariant(customer.email, 'Customer email is required');

    const organizer = await ctx.actions.getOrganizerByEmail({
      email: customer.email,
    });

    invariant(organizer, organizerNotFoundError);

    if (organizer.subscriptionId) {
      await ctx.prisma.subscription.delete({
        where: {
          id: organizer.subscriptionId,
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