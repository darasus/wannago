import {ActionParams, Currency} from '../types';

export function payoutAvailableBalanceToConnectedAccount({ctx}: ActionParams) {
  return async ({stripeLinkedAccountId}: {stripeLinkedAccountId: string}) => {
    const balance = await ctx.stripe.balance.retrieve(
      {},
      {stripeAccount: stripeLinkedAccountId}
    );

    const map = balance.pending.reduce(
      (acc, balance) => {
        acc[balance.currency as Currency] =
          acc[balance.currency as Currency] + balance.amount;

        return acc;
      },
      {
        usd: 0,
        eur: 0,
        gbp: 0,
      } satisfies Record<Currency, number>
    );

    for (const [currency, amount] of Object.entries(map)) {
      if (amount > 0) {
        await ctx.stripe.payouts.create(
          {amount, currency},
          {stripeAccount: stripeLinkedAccountId}
        );
      }
    }

    return {success: true};
  };
}
