import {UserPlusIcon, UserMinusIcon} from '@heroicons/react/24/outline';
import {useFollow} from 'hooks';
import {useRouter} from 'next/router';
import {Button} from 'ui';

export function FollowButton() {
  const router = useRouter();
  const organizationId = router.query.organizationId as string;
  const userId = router.query.userId as string;
  const {handleFollow, handleUnfollow, isLoading, amFollowing} = useFollow({
    organizationId,
    userId,
  });

  if (amFollowing) {
    return (
      <Button
        size="xs"
        iconLeft={<UserMinusIcon />}
        variant="danger"
        onClick={handleUnfollow}
        isLoading={isLoading}
        className="w-40"
        data-testid="message-button"
      >
        Unfollow
      </Button>
    );
  }

  return (
    <Button
      size="xs"
      iconLeft={<UserPlusIcon />}
      variant="neutral"
      onClick={handleFollow}
      isLoading={isLoading}
      className="w-40"
      data-testid="message-button"
    >
      Follow
    </Button>
  );
}
