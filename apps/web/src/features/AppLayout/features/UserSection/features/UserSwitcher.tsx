import {useMyUserQuery, useBreakpoint} from 'hooks';
import {useRouter} from 'next/router';
import {Avatar, Button} from 'ui';

export function UserSwitcher() {
  const size = useBreakpoint();
  const canShowLabel = size !== 'sm';
  const router = useRouter();
  const me = useMyUserQuery();

  return (
    <>
      {me.data && (
        <Button
          variant="neutral"
          iconLeft={
            <Avatar
              className="h-6 w-6"
              src={me.data.profileImageSrc}
              alt={'avatar'}
            />
          }
          onClick={() => {
            router.push(`/u/${me.data?.id}`);
          }}
          data-testid="header-user-button"
        >
          {canShowLabel ? me.data.firstName : null}
        </Button>
      )}
    </>
  );
}
