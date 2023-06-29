import {Container, Text} from 'ui';
import {SectionContainer} from './SectionContainer';
import {SectionHeader} from './SectionHeader';
import {PricingPlan} from './PricingPlan';
import {api} from '../../trpc/server';
import {ShieldCheck} from 'lucide-react';

export async function Pricing() {
  const currency = await api.payments.getCurrency.query();

  return (
    <SectionContainer id="pricing">
      <Container maxSize="lg" className="my-0">
        <SectionHeader
          title="Simple pricing, for everyone."
          description={`Straightforward pricing without hidden fees.`}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 m-auto">
          <PricingPlan
            name="Starter"
            price={0}
            description="Anyone running small and private events, or just starting up."
            features={['Up to 5 events', 'Up to 50 attendees']}
            type="general"
            planId="starter"
            currency={currency}
          />
          <PricingPlan
            type="featured"
            name="Pro"
            planId="pro"
            price={2900}
            description="Those who run one or more events a month and promote personal brand."
            features={[
              'Unlimited events',
              'Unlimited attendees',
              'Generative AI assistant',
              'Sell tickets (extra fees apply)',
              'Many more upcoming features...',
            ]}
            currency={currency}
          />
          <PricingPlan
            type="highlighted"
            name="Business"
            planId="business"
            price={7900}
            description="Small and medium sized businesses that want to build lasting relationship with their customers."
            features={[
              'Organization profile',
              'Unlimited team members',
              'Unlimited events',
              'Unlimited attendees',
              'Generative AI assistant',
              'Sell tickets (extra fees apply)',
              'Many more upcoming features...',
            ]}
            currency={currency}
          />
          <PricingPlan
            type="general"
            name="Enterprise"
            planId="enterprise"
            price={0}
            description="Large organizations with special needs."
            features={[
              'Everything in Business',
              'SSO',
              'Custom permissions',
              'Custom integration',
              'Priority support',
            ]}
            currency={currency}
          />
        </div>
        <div className="flex items-center justify-center mt-8 px-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-24 h-1w-24 md:w-7 md:h-7 text-green-500" />
            <Text className="text-xl font-bold custom-underline leading-tight">
              All plans include{' '}
              <span className="underline">30-day money back guarantee</span>
            </Text>
          </div>
        </div>
      </Container>
    </SectionContainer>
  );
}
