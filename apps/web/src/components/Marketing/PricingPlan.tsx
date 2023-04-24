import {useAuth} from '@clerk/nextjs';
import {CheckCircleIcon} from '@heroicons/react/24/solid';
import {useRouter} from 'next/router';
import {Button, CardBase, Text} from 'ui';
import {cn} from 'utils';
import {titleFont} from '../../fonts';

interface Props {
  type: 'general' | 'featured' | 'highlighted';
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
  type,
}: Props) {
  const {isSignedIn} = useAuth();
  const router = useRouter();

  const getRedirectUrl = () => {
    if (isSignedIn && planId === 'business') {
      return '/settings/team';
    }
    if (isSignedIn && (planId === 'pro' || planId === 'starter')) {
      return '/settings/personal';
    }

    return '/register';
  };

  const onClick = () => {
    router.push(getRedirectUrl());
  };

  return (
    <>
      <CardBase
        className={cn({
          'bg-gray-500': type === 'featured',
          'bg-gradient-to-br from-brand-100 to-brand-400':
            type === 'highlighted',
        })}
        innerClassName={cn('flex flex-col h-full gap-4', {
          'text-gray-50': type === 'featured' || type === 'highlighted',
        })}
      >
        <div>
          <Text className={cn('mt-4 text-4xl', titleFont.className)}>
            {name}
          </Text>
        </div>
        <div>
          <Text className={cn(titleFont.className, 'text-5xl tracking-tight')}>
            {price}
          </Text>
        </div>
        <div className={cn('flex flex-col gap-y-3 text-sm')}>
          {features.map((feature: any) => (
            <div key={feature} className="flex items-center gap-1">
              <CheckCircleIcon
                className={cn('h-4 w-4 text-green-500', {
                  'text-gray-50': type === 'highlighted',
                })}
              />
              <Text className="font-medium">{feature}</Text>
            </div>
          ))}
        </div>
        <div className="grow" />
        <div
          className={cn('flex flex-col border rounded-xl p-2', {
            'border-gray-200 bg-gray-100': type === 'general',
            'border-gray-800 bg-gray-600': type === 'featured',
          })}
        >
          <div className="flex items-center">
            <Text className={cn('font-bold text-xs uppercase')}>
              Perfect for:
            </Text>
          </div>
          <Text className={cn('text-xs')}>{description}</Text>
        </div>
        <Button
          onClick={onClick}
          variant={type === 'highlighted' ? 'neutral' : 'primary'}
        >
          {planId === 'enterprise' ? 'Contact sales' : 'Get started'}
        </Button>
      </CardBase>
    </>
  );
}
