'use client';

import {useAuth} from '@clerk/nextjs';
import {useRouter} from 'next/navigation';
import {Button, CardBase, Text} from 'ui';
import {cn, formatCents} from 'utils';
import {titleFont} from '../../fonts';
import {Currency} from '@prisma/client';
import {CheckCircle} from 'lucide-react';

interface Props {
  type: 'general' | 'featured';
  name: string;
  description: string;
  price: number;
  planId: 'starter' | 'pro' | 'business' | 'enterprise';
  features: string[];
  currency: Currency;
}

export function PricingPlan({
  name,
  planId,
  description,
  price,
  features,
  type,
  currency,
}: Props) {
  const {isSignedIn} = useAuth();
  const router = useRouter();

  const getRedirectUrl = () => {
    if (isSignedIn && planId === 'business') {
      return '/organizations';
    }
    if (isSignedIn && (planId === 'pro' || planId === 'starter')) {
      return '/settings';
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
          'bg-gradient-to-br from-primary/70 to-primary': type === 'featured',
        })}
        innerClassName={cn('flex flex-col h-full gap-4', {
          'text-gray-50': type === 'featured',
        })}
      >
        <div>
          <Text className={cn('mt-4 text-4xl', titleFont.className)}>
            {name}
          </Text>
        </div>
        <div>
          <Text className={cn(titleFont.className, 'text-5xl tracking-tight')}>
            {planId === 'enterprise' ? 'Custom' : formatCents(price, currency)}
          </Text>
        </div>
        <div className={cn('flex flex-col gap-y-3 text-sm')}>
          {features.map((feature: any) => (
            <div key={feature} className="flex items-center gap-1">
              <CheckCircle className={cn('h-4 w-4 text-green-500')} />
              <Text className="font-medium">{feature}</Text>
            </div>
          ))}
        </div>
        <div className="grow" />
        <div
          className={cn(
            'flex flex-col border rounded-xl p-2 border-gray-200 bg-gray-100',
            {
              'border-white/20 bg-white/10': type === 'featured',
            }
          )}
        >
          <div className="flex items-center">
            <Text className={cn('font-bold text-xs uppercase')}>
              Ideal for:
            </Text>
          </div>
          <Text className={cn('text-xs')}>{description}</Text>
        </div>
        <Button
          onClick={onClick}
          className={cn({
            'text-primary': type === 'featured',
          })}
          variant={type === 'featured' ? 'outline' : 'default'}
        >
          {planId === 'enterprise' ? 'Contact sales' : 'Get started'}
        </Button>
      </CardBase>
    </>
  );
}
