'use server';

import {api} from '../../../../trpc/server-http';

export async function revalidateFollow({
  userId,
  organizationId,
}: {
  userId: string | undefined;
  organizationId: string | undefined;
}) {
  const props = {
    userId,
    organizationId,
  };
  await api.follow.amFollowing.revalidate(props);
  await api.follow.getFollowCounts.revalidate(props);
}
