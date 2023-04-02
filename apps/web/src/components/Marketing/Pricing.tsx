import {Container} from 'ui';
import {SectionContainer} from './SectionContainer';
import {SectionHeader} from './SectionHeader';
import {PricingPlan} from './PricingPlan';

export function Pricing() {
  return (
    <SectionContainer id="features" className="bg-white">
      <Container maxSize="full" className="my-0">
        <SectionHeader
          title="Simple pricing, for everyone."
          description={`Straightforward pricing without hidden fees.`}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 m-auto">
          <PricingPlan
            name="Starter"
            price="$0"
            description="Great for anyone running small private events."
            features={['Up to 50 invites', 'Up to 5 events']}
            featured={false}
            planId="starter"
          />
          <PricingPlan
            featured
            name="Pro"
            planId="pro"
            price="$2.99"
            description="Perfect for small / medium sized businesses."
            features={[
              'Unlimited invites',
              'Unlimited attendees',
              'Unlimited events',
              'AI assistant',
              'Many more upcoming features...',
            ]}
          />
          <PricingPlan
            featured
            name="Business"
            planId="business"
            price="$9.99"
            description="Perfect for enterprise and special needs."
            features={[
              'Everything in Pro',
              'Unlimited team members',
              'Many more upcoming features...',
            ]}
          />
          <PricingPlan
            featured
            name="Enterprise"
            planId="enterprise"
            price="Custom"
            description="Perfect for large organizations with special needs."
            features={['Everything in Business', 'SSO', 'Custom permissions']}
          />
        </div>
      </Container>
    </SectionContainer>
  );
}
