import {
  useMyOrganizationQuery,
  useMyUserQuery,
  useSessionQuery,
  useSetSessionMutation,
  useBreakpoint,
} from 'hooks';
import {useRouter} from 'next/router';
import {Avatar, Button} from 'ui';
import {cn} from 'utils';

export function UserSwitcher() {
  const size = useBreakpoint();
  const canShowLabel = size !== 'sm';
  const router = useRouter();
  const me = useMyUserQuery();
  const organization = useMyOrganizationQuery();
  const session = useSessionQuery();
  const setSession = useSetSessionMutation();

  return (
    <>
      {me.data && (
        <Button
          className={cn(
            {
              'opacity-50': session.data === 'organization',
            },
            'hover:opacity-100'
          )}
          variant="neutral"
          iconLeft={
            <Avatar
              className="h-6 w-6"
              src={me.data.profileImageSrc}
              alt={'avatar'}
            />
          }
          onClick={() => {
            if (session.data === 'organization') {
              setSession.mutate({userType: 'user'});
            } else {
              router.push(`/u/${me.data?.id}`);
            }
          }}
          data-testid="header-user-button"
        >
          {session.data === 'user' && canShowLabel ? me.data.firstName : null}
        </Button>
      )}
      {organization.data && (
        <Button
          className={cn(
            {
              'opacity-50': session.data === 'user',
            },
            'hover:opacity-100'
          )}
          variant="neutral"
          iconLeft={
            <Avatar
              className="h-6 w-6"
              src={organization.data.logoSrc}
              alt={'avatar'}
            />
          }
          onClick={() => {
            if (session.data === 'user') {
              setSession.mutate({userType: 'organization'});
            } else {
              router.push(`/o/${organization.data?.id}`);
            }
          }}
          data-testid="organization-header-button"
        >
          {session.data === 'organization' && canShowLabel ? (
            <span className="contents">{organization.data.name}</span>
          ) : null}
        </Button>
      )}
    </>
  );
}
