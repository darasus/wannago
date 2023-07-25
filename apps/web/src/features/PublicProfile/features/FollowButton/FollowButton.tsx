'use client';

import {useParams, useRouter} from 'next/navigation';
import {use, useTransition} from 'react';
import {Button} from 'ui';
import {toast} from 'sonner';
import {type RouterOutputs} from 'api';
import {api} from '../../../../trpc/client';

interface Props {
  amFollowingPromise: Promise<RouterOutputs['follow']['amFollowing']>;
}

export function FollowButton({amFollowingPromise}: Props) {
  const router = useRouter();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const organizationId = params?.organizationId as string | undefined;
  const userId = params?.userId as string | undefined;
  const amFollowing = use(amFollowingPromise);

  if (amFollowing) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          startTransition(async () => {
            await api.follow.unfollow
              .mutate({
                organizationId,
                userId,
              })
              .then(() => {
                router.refresh();
              })
              .catch((error) => {
                toast.error(error.message);
              });
          });
        }}
        disabled={isPending}
        isLoading={isPending}
        className="text-red-500"
        data-testid="unfollow-button"
      >
        Unfollow
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        startTransition(async () => {
          await api.follow.follow
            .mutate({
              organizationId,
              userId,
            })
            .then(() => {
              router.refresh();
            })
            .catch((error) => {
              toast.error(error.message);
            });
        });
      }}
      disabled={isPending}
      isLoading={isPending}
      data-testid="follow-button"
    >
      Follow
    </Button>
  );
}
