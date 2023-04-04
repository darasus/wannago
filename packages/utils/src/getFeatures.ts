import {SubscriptionType} from '@prisma/client';
import {featureConfig} from 'const';

export function getFeatures({
  subscriptionType,
}: {
  subscriptionType: SubscriptionType;
}) {
  return featureConfig[subscriptionType];
}
