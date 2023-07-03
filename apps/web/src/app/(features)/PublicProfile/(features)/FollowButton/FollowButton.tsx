'use client';

import {useParams, useRouter} from 'next/navigation';
import {use, useTransition} from 'react';
import {Button} from 'ui';
import {api} from '../../../../../trpc/client';
import {toast} from 'react-hot-toast';
import {type RouterOutputs} from 'api';

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
              .catch((error) => {
                toast.error(error.message);
              });
            router.refresh();
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
            .catch((error) => {
              toast.error(error.message);
            });
          router.refresh();
        });
      }}
      disabled={isPending}
      data-testid="follow-button"
    >
      Follow
    </Button>
  );
}
