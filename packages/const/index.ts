import {SubscriptionType} from '@prisma/client';

export const REMINDER_PERIOD_IN_SECONDS = 60 * 60 * 3; // 3 hours
export const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

type Permissions = {
  maxNumberOfPersonalEvents: number;
  maxNumberOfOrganizationEvents: number;
  maxNumberOfPersonalEventAttendees: number;
  maxNumberOfOrganizationEventAttendees: number;
  canCreateOrganization: boolean;
  canInviteTeamMembers: boolean;
  canGenerateDescriptionWithAI: boolean;
};

export const featureConfig: Record<SubscriptionType, Permissions> = {
  STARTER: {
    maxNumberOfPersonalEvents: 5,
    maxNumberOfOrganizationEvents: 0,
    maxNumberOfPersonalEventAttendees: 50,
    maxNumberOfOrganizationEventAttendees: 0,
    canCreateOrganization: true,
    canInviteTeamMembers: false,
    canGenerateDescriptionWithAI: false,
  },
  PRO: {
    maxNumberOfPersonalEvents: 1_000_000_000_000,
    maxNumberOfOrganizationEvents: 0,
    maxNumberOfPersonalEventAttendees: 1_000_000_000_000,
    maxNumberOfOrganizationEventAttendees: 0,
    canCreateOrganization: true,
    canInviteTeamMembers: false,
    canGenerateDescriptionWithAI: true,
  },
  BUSINESS: {
    maxNumberOfPersonalEvents: 0,
    maxNumberOfOrganizationEvents: 1_000_000_000_000,
    maxNumberOfPersonalEventAttendees: 0,
    maxNumberOfOrganizationEventAttendees: 1_000_000_000_000,
    canCreateOrganization: true,
    canInviteTeamMembers: true,
    canGenerateDescriptionWithAI: true,
  },
};
