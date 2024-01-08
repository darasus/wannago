import {ActionContext} from '../context';
import {invariant} from 'utils';
import {userNotFoundError} from 'error';
import {feeAmount, feePercent} from 'const';
import {Currency} from '@prisma/client';

interface Props {
  stripeCustomerId: string;
  eventId: string;
  ticketSaleIds: string[];
  amount: number;
  currency: Currency;
}

export function createPaymentIntent(ctx: ActionContext) {
  return async ({
    eventId,
    stripeCustomerId,
    ticketSaleIds,
    amount,
    currency,
  }: Props) => {
    invariant(ctx.auth?.user.id, userNotFoundError);

    const session = await ctx.stripe.paymentIntents.create({
      amount,
      currency: currency.toLocaleLowerCase(),
      customer: stripeCustomerId,
      application_fee_amount: calculateFee(amount),
      metadata: {
        externalUserId: ctx.auth.user.id,
        eventId: eventId,
        ticketSaleIds: JSON.stringify(ticketSaleIds),
      },
    });

    return session;
  };
}

function calculateFee(totalAmountInCents: number) {
  const feeInCents = totalAmountInCents * feePercent + feeAmount;

  return Math.round(feeInCents);
}
