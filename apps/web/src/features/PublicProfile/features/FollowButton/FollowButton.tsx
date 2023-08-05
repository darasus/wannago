'use client';

import {useParams, useRouter} from 'next/navigation';
import {use, useCallback, useState} from 'react';
import {Button} from 'ui';
import {toast} from 'sonner';
import {type RouterOutputs} from 'api';
import {api} from '../../../../trpc/client';
import {revalidateFollow} from '../../../../actions';

interface Props {
  amFollowingPromise: Promise<RouterOutputs['follow']['amFollowing']>;
}

export function FollowButton({amFollowingPromise}: Props) {
  const amFollowing = use(amFollowingPromise);
  const [unfollowLabel, setUnfollowLabel] = useState<'Unfollow' | 'Following'>(
    'Following'
  );
  const router = useRouter();
  const params = useParams();
  const [isPending, setIsPending] = useState(false);
  const organizationId = params?.organizationId as string | undefined;
  const userId = params?.userId as string | undefined;

  const handleClick = useCallback(async () => {
    setIsPending(true);
    const props = {
      organizationId,
      userId,
    };
    const getAction = () => {
      return amFollowing
        ? api.follow.unfollow.mutate(props)
        : api.follow.follow.mutate(props);
    };

    try {
      await getAction();
      await revalidateFollow(props);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  }, [amFollowing, organizationId, userId, router]);

  return (
    <Button
      size="sm"
      variant="outline"
      onMouseEnter={() => {
        setUnfollowLabel('Unfollow');
      }}
      onMouseLeave={() => {
        setUnfollowLabel('Following');
      }}
      onClick={handleClick}
      disabled={isPending}
      isLoading={isPending}
      data-testid="follow-button"
    >
      {amFollowing ? unfollowLabel : 'Follow'}
    </Button>
  );
}
