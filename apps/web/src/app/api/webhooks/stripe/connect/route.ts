import type {Stripe as IStripe} from 'stripe';

import {NextRequest, NextResponse} from 'next/server';

import {stripe} from 'lib/src/stripe';
import {createContext} from 'api/src/context';
import {stripeWebhookHandlerRouter} from 'api/src/routers/stripeWebhookHandler';
import {
  baseEventHandlerSchema,
  handleCheckoutSessionCompletedInputSchema,
} from 'stripe-webhook-input-validation';
import {env} from 'env/server';

export async function POST(req: NextRequest) {
  let event: IStripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get('stripe-signature') as string,
      env.STRIPE_ENDPOINT_SECRET
    );
  } catch (err) {
    console.error(err);

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {message: `Webhook Error: ${errorMessage}`},
      {status: 400}
    );
  }

  const ctx = await createContext();
  const caller = stripeWebhookHandlerRouter.createCaller(ctx);

  try {
    const input = baseEventHandlerSchema.parse(event);

    if (input.type === 'payment_intent.succeeded') {
      await caller.handleCheckoutSessionCompleted(
        handleCheckoutSessionCompletedInputSchema.parse(event)
      );
    }

    return NextResponse.json({success: true}, {status: 200});
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {message: `Webhook Error: ${err.message}`},
      {status: 400}
    );
  }
}
