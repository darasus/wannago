import {NextApiRequest, NextApiResponse} from 'next';
import {buffer} from 'micro';
import {Stripe} from 'lib/src/stripe';
import Cors from 'micro-cors';
import {createContext} from 'api/src/context';
import {stripeWebhookHandlerRouter} from 'api/src/routers/stripeWebhookHandler';
import {
  baseEventHandlerSchema,
  handleCheckoutSessionCompletedInputSchema,
  handleCustomerSubscriptionDeletedInputSchema,
  handleCustomerSubscriptionUpdatedInputSchema,
} from 'stripe-webhook-input-validation';
import {captureException} from '@sentry/nextjs';
import {NextRequest} from 'next/server';

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
  const ctx = await createContext({req: req as unknown as NextRequest});
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

    if (input.type === 'checkout.session.completed') {
      await caller.handleCheckoutSessionCompleted(
        handleCheckoutSessionCompletedInputSchema.parse(event)
      );
    }

    return res.status(200).json({success: true});
  } catch (err: any) {
    captureException(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

export default cors(handler as any);