import {env} from 'server-env';
import * as s from 'stripe';

export class Stripe {
  stripe = new s.Stripe(env.STRIPE_API_KEY, {
    apiVersion: '2022-11-15',
  });

  private endpointSecret = env.STRIPE_ENDPOINT_SECRET;

  constructEvent(payload: string, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.endpointSecret
    );
  }
}
