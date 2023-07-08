import {StripeAccountLinkSettings} from '../../../(features)/StripeAccountLinkSettings/StripeAccountLinkSettings';
import {RouterOutputs} from 'api';
import {notFound} from 'next/navigation';
import {api} from '../../../../trpc/server-http';

interface Props {
  userPromise: Promise<RouterOutputs['user']['me']>;
}

export async function StripeSettings({userPromise}: Props) {
  const user = await userPromise;

  if (!user) {
    return notFound();
  }

  const stripeAccountPromise = api.stripeAccountLink.getAccount.query({
    organizerId: user.id,
  });

  return (
    <StripeAccountLinkSettings
      stripeAccountPromise={stripeAccountPromise}
      organizerId={user?.id}
    />
  );
}