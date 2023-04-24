import {
  useHasUnseenConversation,
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
  const canShowLabel = useBreakpoint('md', false);
  const router = useRouter();
  const me = useMyUserQuery();
  const organization = useMyOrganizationQuery();
  const hasUnseenConversation = useHasUnseenConversation();
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
              data-testid="user-header-button"
              alt={'avatar'}
            />
          }
          hasNotificationBadge={hasUnseenConversation.data}
          onClick={() => {
            if (session.data === 'organization') {
              setSession.mutate({userType: 'user'});
            } else {
              router.push(`/u/${me.data?.id}`);
            }
          }}
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
              data-testid="user-header-button"
              alt={'avatar'}
            />
          }
          hasNotificationBadge={hasUnseenConversation.data}
          onClick={() => {
            if (session.data === 'user') {
              setSession.mutate({userType: 'organization'});
            } else {
              router.push(`/o/${organization.data?.id}`);
            }
          }}
        >
          {session.data === 'organization' && canShowLabel ? (
            <span className="contents">{organization.data.name}</span>
          ) : null}
        </Button>
      )}
    </>
  );
}
