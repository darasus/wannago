import {env} from 'server-env';
import * as s from 'stripe';

export const stripe = new s.Stripe(env.STRIPE_API_SECRET, {
  apiVersion: '2023-10-16',
});
