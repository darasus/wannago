import {CardBase, Container, Text} from 'ui';
import {SectionContainer} from './SectionContainer';
import {SectionHeader} from './SectionHeader';
import {api} from '../../../trpc/server-http';
import {cn, formatCents, formatPercent} from 'utils';
import {titleFont} from '../../../fonts';
import {CheckCircle} from 'lucide-react';
import {feeAmount, feePercent} from 'const';
import {GetStartedButton} from './GetStartedButton';

export async function Pricing() {
  const currency = await api.payments.getCurrency.query();

  return (
    <SectionContainer id="pricing">
      <Container maxSize="lg" className="my-0">
        <SectionHeader
          title="Simple pricing, for everyone."
          description={`Straightforward pricing without hidden fees.`}
        />
        <div className="flex justify-center">
          <CardBase>
            <div className="flex flex-col h-full gap-4 w-72">
              <div>
                <Text className={cn('mt-4 text-4xl', titleFont.className)}>
                  Standard
                </Text>
              </div>
              <div>
                <Text
                  className={cn(titleFont.className, 'text-5xl tracking-tight')}
                >
                  {`${formatCents(feeAmount, currency)} + ${formatPercent(
                    feePercent
                  )}`}
                </Text>
                <div />
                <Text className="text-sm text-gray-500">Per sold ticket</Text>
              </div>
              <div className={cn('flex flex-col gap-y-3 text-sm')}>
                {[
                  'Unlimited events',
                  'Unlimited attendees',
                  'Organization profiles',
                  'Unlimited organization members',
                  'No fees for free events',
                ].map((feature: any) => (
                  <div key={feature} className="flex items-center gap-1">
                    <CheckCircle className={cn('h-4 w-4 text-green-500')} />
                    <Text className="font-medium">{feature}</Text>
                  </div>
                ))}
              </div>
              <div className="grow" />
              <GetStartedButton />
            </div>
          </CardBase>
        </div>
      </Container>
    </SectionContainer>
  );
}
