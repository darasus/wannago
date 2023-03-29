import {NextApiRequest, NextApiResponse} from 'next';
import {buffer} from 'micro';
import {Stripe} from 'lib';
import Cors from 'micro-cors';
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

  let event;

  try {
    event = stripe.constructEvent(buf.toString(), sig);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as s.Stripe.PaymentIntent;
    console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as s.Stripe.PaymentIntent;
    console.log(
      `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
    );
  } else if (event.type === 'charge.succeeded') {
    const charge = event.data.object as s.Stripe.Charge;
    console.log(JSON.stringify(event, null, 2));
    console.log(`💵 Charge id: ${charge.id}`);
    const account = await stripe.stripe.accounts.retrieve(
      charge.destination as string
    );
    const email = account.individual?.email;
  } else {
    console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({success: true});
}

export default cors(handler as any);
