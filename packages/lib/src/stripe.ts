import * as s from 'stripe';

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

  async getPaymentLink({email}: {email: string}) {
    const link = await this.stripe.paymentLinks.retrieve(
      'link_1Mj0ZgFblQX9XpW1QZ2Z2Q2a'
    );

    const url = new URL(link.url);

    url.searchParams.append('prefilled_email', email);

    return {url: url.toString()};
  }
}
