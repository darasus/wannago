import {RouterOutputs} from '../../../../../../trpc/client';
import {TeamMembersSettings} from '../TeamMemberSettings/TeamMembersSettings';
import {OrganizationDetailsSettings} from '../OrganizationDetailsSettings/OrganizationDetailsSettings';
import {Suspense} from 'react';
import {Organization} from '@prisma/client';
import {OrganizationSubscription} from '../OrganizationSubscription/OrganizationSubscription';
import {LoadingBlock} from 'ui';
import {StripeAccountLinkSettings} from '../StripeAccountLinkSettings/StripeAccountLinkSettings';

interface OrganizationSettingsProps {
  organization: Organization;
  mySubscriptionPromise: Promise<
    RouterOutputs['subscriptionPlan']['getMySubscription']
  >;
}

export function OrganizationSettings({
  organization,
  mySubscriptionPromise,
}: OrganizationSettingsProps) {
  return (
    <div className="flex flex-col gap-4">
      <OrganizationDetailsSettings organization={organization} />
      <TeamMembersSettings organization={organization} />
      <Suspense fallback={<LoadingBlock />}>
        <OrganizationSubscription
          organization={organization}
          mySubscriptionPromise={mySubscriptionPromise}
        />
      </Suspense>
      <StripeAccountLinkSettings type="BUSINESS" />
    </div>
  );
}
