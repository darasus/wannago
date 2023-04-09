import {Container} from 'ui';
import {SectionContainer} from './SectionContainer';
import {SectionHeader} from './SectionHeader';
import {PricingPlan} from './PricingPlan';

export function Pricing() {
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
            price="$0"
            description="Great for anyone running small private events."
            features={['Up to 5 events', 'Up to 50 attendees']}
            featured={false}
            planId="starter"
          />
          <PricingPlan
            featured
            name="Pro"
            planId="pro"
            price="$2.99"
            description="For individuals that run recurring events."
            features={[
              'Unlimited events',
              'Unlimited attendees',
              'AI assistant',
              'Many more upcoming features...',
            ]}
          />
          <PricingPlan
            featured
            name="Business"
            planId="business"
            price="$9.99"
            description="For small and medium sized businesses."
            features={[
              'Organization profile',
              'Unlimited team members',
              'Unlimited events',
              'Unlimited attendees',
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
