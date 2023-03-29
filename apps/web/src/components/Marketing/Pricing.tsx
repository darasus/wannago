import {Container} from 'ui';
import {SectionContainer} from './SectionContainer';
import {SectionHeader} from './SectionHeader';
import {PricingPlan} from './PricingPlan';

export function Pricing() {
  return (
    <SectionContainer id="features" className="bg-white">
      <Container className="my-0">
        <SectionHeader
          title="Simple pricing, for everyone."
          description={`Straightforward pricing without hidden fees.`}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl m-auto">
          <PricingPlan
            name="WannaGo Starter"
            price="$0"
            description="Great for anyone who is self-employed and just getting started."
            features={['Up to 100 invites', 'Up to 10 events']}
            featured={false}
            planId="starter"
          />
          <PricingPlan
            featured
            name="WannaGo Pro"
            planId="pro"
            price="$2.99"
            description="Perfect for small / medium sized businesses."
            features={[
              'Unlimited invites',
              'Unlimited attendees',
              'Unlimited events',
              'Unlimited team members',
              'AI assistant',
              'Many more upcoming features...',
            ]}
          />
        </div>
      </Container>
    </SectionContainer>
  );
}
