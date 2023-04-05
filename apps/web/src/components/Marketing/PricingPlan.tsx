import {CheckCircleIcon} from '@heroicons/react/24/solid';
import {useRouter} from 'next/router';
import {Button, CardBase, Text} from 'ui';
import {cn} from 'utils';
import {titleFont} from '../../fonts';

interface Props {
  featured: boolean;
  name: string;
  description: string;
  price: string;
  planId: 'starter' | 'pro' | 'business' | 'enterprise';
  features: string[];
}

export function PricingPlan({
  name,
  planId,
  description,
  price,
  features,
  featured,
}: Props) {
  const router = useRouter();

  const onClick = () => {
    router.push(`/register?plan=${planId}`);
  };

  return (
    <>
      <CardBase
        className={cn('flex flex-col', {
          'bg-gray-500': featured,
        })}
        innerClassName="flex flex-col grow"
      >
        <Text
          className={cn('mt-4 text-4xl', titleFont.className, {
            'text-gray-50': featured,
          })}
        >
          {name}
        </Text>
        <div />
        <Text
          className={cn('mb-4 font-medium', {
            'text-gray-50': featured,
          })}
        >
          {description}
        </Text>
        <div className="mb-8" />
        <Text
          className={cn(titleFont.className, 'text-5xl tracking-tight', {
            'text-gray-50': featured,
          })}
        >
          {price}
        </Text>
        <div className="mb-8" />
        <div
          className={cn('flex flex-col gap-y-3 text-sm', {
            'text-gray-50': featured,
          })}
        >
          {features.map((feature: any) => (
            <div key={feature} className="flex items-center gap-1">
              <CheckCircleIcon className={cn('h-4 w-4 text-green-500')} />
              <Text className="font-medium">{feature}</Text>
            </div>
          ))}
        </div>
        <div className="grow mb-6" />
        <Button onClick={onClick}>
          {planId === 'enterprise' ? 'Get in touch' : 'Get started'}
        </Button>
      </CardBase>
    </>
  );
}
