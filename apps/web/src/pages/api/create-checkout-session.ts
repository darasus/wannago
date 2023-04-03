import {NextApiRequest, NextApiResponse} from 'next';
import {Stripe} from 'lib';
import {getBaseUrl} from 'utils';
import {z} from 'zod';

const stripe = new Stripe().stripe;

const queryScheme = z.object({
  plan: z.enum(['wannago_pro']),
  customerEmail: z.string().email(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {plan, customerEmail} = queryScheme.parse(req.query);

  const prices = await stripe.prices.list({
    lookup_keys: [plan],
    expand: ['data.product'],
  });

  const session = await stripe.checkout.sessions.create({
    customer_email: customerEmail,
    billing_address_collection: 'auto',
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    // TODO: fix
    success_url: `${getBaseUrl()}/settings/personal`,
    cancel_url: `${getBaseUrl()}/settings/personal`,
  });

  res.redirect(303, session.url!);
}
