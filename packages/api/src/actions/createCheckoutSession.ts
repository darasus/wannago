import {ActionContext} from '../context';
import {getBaseUrl, invariant} from 'utils';
import {eventNotFoundError, userNotFoundError} from 'error';
import {feeAmount, feePercent} from 'const';
import {Prisma, PrismaClient} from '@prisma/client';
import {DefaultArgs} from '@prisma/client/runtime/library';

interface Props {
  email: string;
  stripeCustomerId: string;
  eventId: string;
  tickets: {ticketId: string; quantity: number}[];
  ticketSaleIds: string[];
  prisma: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >;
}

export function createCheckoutSession(ctx: ActionContext) {
  return async ({
    email,
    eventId,
    tickets,
    stripeCustomerId,
    ticketSaleIds,
    prisma,
  }: Props) => {
    invariant(ctx.auth?.user.id, userNotFoundError);

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        organization: true,
        user: true,
        tickets: true,
        ticketSales: true,
      },
    });

    invariant(event, eventNotFoundError);

    const selectedTickets = await prisma.ticket.findMany({
      where: {
        id: {
          in: tickets.map((ticket) => ticket.ticketId),
        },
      },
    });

    const totalAmount = tickets.reduce((acc, ticket) => {
      const {price} =
        selectedTickets.find((t) => t.id === ticket.ticketId) || {};

      if (!price) {
        return acc;
      }

      return acc + ticket.quantity * price;
    }, 0);

    const successCallbackUrl = `${getBaseUrl()}/e/${
      event.shortId
    }/my-tickets?success=true`;
    const cancelCallbackUrl = `${getBaseUrl()}/e/${event.shortId}`;

    const stripeLinkedAccountId =
      event?.organization?.stripeLinkedAccountId ||
      event?.user?.stripeLinkedAccountId;

    invariant(stripeLinkedAccountId);

    const session = await ctx.stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      customer_email: stripeCustomerId ? undefined : email,
      customer_update: stripeCustomerId
        ? {
            name: 'auto',
            address: 'auto',
          }
        : undefined,
      billing_address_collection: 'auto',
      line_items: selectedTickets.map((ticket) => {
        return {
          quantity: tickets.find((t) => t.ticketId === ticket.id)?.quantity,
          price_data: {
            product_data: {
              name: ticket.title,
            },
            currency: event.preferredCurrency || 'USD',
            unit_amount: ticket.price,
          },
        };
      }),
      mode: 'payment',
      success_url: successCallbackUrl,
      cancel_url: cancelCallbackUrl,
      tax_id_collection: {
        enabled: true,
      },
      allow_promotion_codes: false,
      metadata: {
        externalUserId: ctx.auth.user.id,
        eventId: eventId,
        ticketSaleIds: JSON.stringify(ticketSaleIds),
      },
      payment_intent_data: {
        application_fee_amount: calculateFee(totalAmount),
        transfer_data: {
          destination: stripeLinkedAccountId,
        },
      },
    });

    return session;
  };
}

function calculateFee(totalAmountInCents: number) {
  const feeInCents = totalAmountInCents * feePercent + feeAmount;

  return Math.round(feeInCents);
}
