import {env} from 'server-env';
import * as s from 'stripe';

export const stripe = new s.Stripe(env.STRIPE_API_SECRET, {
  apiVersion: '2023-10-16',
});

export const createStripeClient = (stripeAccountId: string) => {
  return new s.Stripe(env.STRIPE_API_SECRET, {
    apiVersion: '2023-10-16',
    stripeAccount: stripeAccountId,
  });
};
