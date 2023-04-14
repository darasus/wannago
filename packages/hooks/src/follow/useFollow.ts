import {useAuth} from '@clerk/nextjs';
import {useCallback} from 'react';
import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {useMyUserQuery} from '../user/useMyUserQuery';

export function useFollow({
  userId,
  organizationId,
}: {
  userId?: string;
  organizationId?: string;
}) {
  const auth = useAuth();
  const me = useMyUserQuery();
  const followCounts = trpc.follow.getFollowCounts.useQuery({
    userId,
    organizationId,
  });
  const amFollowing = trpc.follow.amFollowing.useQuery(
    {
      userId,
      organizationId,
    },
    {
      enabled: auth.isSignedIn,
    }
  );
  const followMutation = trpc.follow.follow.useMutation({
    onError: async error => {
      toast.error(error.message);
    },
    onSuccess: async () => {
      await followCounts.refetch();
      await amFollowing.refetch();
    },
  });
  const unfollowMutation = trpc.follow.unfollow.useMutation({
    onError: async error => {
      toast.error(error.message);
    },
    onSuccess: async () => {
      await followCounts.refetch();
      await amFollowing.refetch();
    },
  });
  const isMutating = followMutation.isLoading || unfollowMutation.isLoading;

  const isLoading = amFollowing.isInitialLoading || me.isInitialLoading;

  const handleFollow = useCallback(async () => {
    await followMutation.mutateAsync({userId, organizationId});
  }, [followMutation, userId, organizationId]);

  const handleUnfollow = useCallback(async () => {
    await unfollowMutation.mutateAsync({userId, organizationId});
  }, [unfollowMutation, userId, organizationId]);

  return {
    handleFollow,
    handleUnfollow,
    isLoading,
    isMutating,
    followCounts,
    amFollowing: amFollowing.data,
  };
}
