import {NextApiRequest, NextApiResponse} from 'next';
import {Stripe} from 'lib';
import {getBaseUrl} from 'utils';
import {z} from 'zod';

const stripe = new Stripe().stripe;

const queryScheme = z.object({
  customerId: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {customerId} = queryScheme.parse(req.query);
  const customer = await stripe.customers.retrieve(customerId);

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    // TODO: fix
    return_url: `${getBaseUrl()}/settings/personal`,
  });

  res.redirect(303, portalSession.url);
}
