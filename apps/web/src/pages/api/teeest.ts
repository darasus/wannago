import {Stripe} from 'lib';
import {NextApiRequest, NextApiResponse} from 'next';

const stripe = new Stripe();

type Currency = 'usd' | 'eur' | 'gbp';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stripeLinkedAccountId = 'acct_1NGbxhFLaVuU6UQr';

  const balance = await stripe.client.balance.retrieve(
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
      await stripe.client.payouts.create(
        {amount, currency},
        {stripeAccount: stripeLinkedAccountId}
      );
    }
  }

  res.json(map);
}
