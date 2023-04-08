import {SubscriptionType} from '@prisma/client';

type Permissions = {
  maxNumberOfPersonalEvents: number;
  maxNumberOfOrganizationEvents: number;
  maxNumberOfPersonalEventAttendees: number;
  maxNumberOfOrganizationEventAttendees: number;
};

export const featureConfig: Record<SubscriptionType | 'STARTER', Permissions> =
  {
    STARTER: {
      maxNumberOfPersonalEvents: 5,
      maxNumberOfOrganizationEvents: 0,
      maxNumberOfPersonalEventAttendees: 50,
      maxNumberOfOrganizationEventAttendees: 0,
    },
    PRO: {
      maxNumberOfPersonalEvents: 1_000_000_000_000,
      maxNumberOfOrganizationEvents: 0,
      maxNumberOfPersonalEventAttendees: 1_000_000_000_000,
      maxNumberOfOrganizationEventAttendees: 0,
    },
    BUSINESS: {
      maxNumberOfPersonalEvents: 0,
      maxNumberOfOrganizationEvents: 1_000_000_000_000,
      maxNumberOfPersonalEventAttendees: 0,
      maxNumberOfOrganizationEventAttendees: 1_000_000_000_000,
    },
  };

export function getFeatures({
  subscriptionType,
}: {
  subscriptionType: SubscriptionType | 'STARTER';
}) {
  return featureConfig[subscriptionType];
}
