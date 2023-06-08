import {env} from 'server-env';
import * as s from 'stripe';

export class Stripe {
  client = new s.Stripe(env.STRIPE_API_SECRET, {
    apiVersion: '2022-11-15',
  });

  private endpointSecret = env.STRIPE_ENDPOINT_SECRET;

  constructEvent(payload: string, signature: string) {
    return this.client.webhooks.constructEvent(
      payload,
      signature,
      this.endpointSecret
    );
  }
}
