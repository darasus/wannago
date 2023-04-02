import {NextApiRequest, NextApiResponse} from 'next';
import {buffer} from 'micro';
import {Stripe} from 'lib';
import Cors from 'micro-cors';
import {createContext} from 'trpc/src/context';
import {stripeWebhookHandlerRouter} from 'trpc/src/routers/stripeWebhookHandler';
import {
  baseEventHandlerSchema,
  handleCustomerSubscriptionCreatedInputSchema,
  handleCustomerSubscriptionDeletedInputSchema,
  handleCustomerSubscriptionUpdatedInputSchema,
} from 'stripe-webhook-input-validation';
import * as s from 'stripe';

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method Not Allowed'});
  }

  const stripe = new Stripe();
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;
  const ctx = await createContext({req, res});
  const caller = stripeWebhookHandlerRouter.createCaller(ctx);

  try {
    const event = stripe.constructEvent(buf.toString(), sig);
    const input = baseEventHandlerSchema.parse(event);

    if (input.type === 'customer.subscription.updated') {
      await caller.handleCustomerSubscriptionUpdated(
        handleCustomerSubscriptionUpdatedInputSchema.parse(event)
      );
    }

    if (input.type === 'customer.subscription.deleted') {
      await caller.handleCustomerSubscriptionDeleted(
        handleCustomerSubscriptionDeletedInputSchema.parse(event)
      );
    }

    return res.status(200).json({success: true});
  } catch (err: any) {
    console.log(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

export default cors(handler as any);
