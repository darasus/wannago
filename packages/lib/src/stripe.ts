import * as s from 'stripe';
import {getBaseUrl} from 'utils';

export class Stripe {
  stripe = new s.Stripe(
    'sk_test_51Miu4NFblQX9XpW1vw1uggNyENZmHcCsf92MyP8XYMBVOMEHKTVfwRsB5UKzP05jJyOhjMHQPpOMNTX4GFAf5vEp008dO1LRBS',
    {
      apiVersion: '2022-11-15',
    }
  );

  private endpointSecret =
    'whsec_5106561d0843adec42760b10b6189ab007de1a8276f82d487ef81f1b192a4f14';

  constructEvent(payload: string, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.endpointSecret
    );
  }

  async createPaymentLink() {
    return this.stripe.paymentLinks.create({
      line_items: [
        {
          price: 'price_1MqCgxFblQX9XpW1pVO5cfTn',
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect: {url: `${getBaseUrl()}/subscription-success`},
      },
    });
  }
}
