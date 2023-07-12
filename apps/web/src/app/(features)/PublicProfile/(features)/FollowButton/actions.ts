'use server';

import {api} from '../../../../../trpc/server-http';

export async function follow({
  organizationId,
  userId,
}: {
  organizationId: string | undefined;
  userId: string | undefined;
}) {
  await api.follow.follow.mutate({
    organizationId,
    userId,
  });
  await api.follow.getFollowCounts.revalidate();
}

export async function unfollow({
  organizationId,
  userId,
}: {
  organizationId: string | undefined;
  userId: string | undefined;
}) {
  await api.follow.unfollow.mutate({
    organizationId,
    userId,
  });
  await api.follow.getFollowCounts.revalidate();
}
