import Head from 'next/head';
import {Button, Container, LoadingBlock, PageHeader} from 'ui';
import {TeamSettings} from './features/TeamSettings/TeamSettings';
import {UserSettings} from './features/UserSettings/UserSettings';
import {withProtected} from '../../utils/withAuthProtect';
import {useMyOrganizationQuery, useMyUserQuery} from 'hooks';
import {useRouter} from 'next/router';
import {UserSubscription} from './features/UserSubscription/UserSubscription';

type SettingsPageType = 'personal' | 'team';

function SettingsPage() {
  const router = useRouter();
  const settings = (router.query.settings as string[]).join(
    ''
  ) as SettingsPageType;
  const organization = useMyOrganizationQuery();
  const user = useMyUserQuery();

  if (
    (user.isLoading || organization.isLoading) &&
    (!user.data || !organization.data)
  ) {
    return <LoadingBlock />;
  }

  const pageHeaderTitle: Record<SettingsPageType, string> = {
    personal: 'Personal settings',
    team: 'Team settings',
  };

  return (
    <>
      <Head>
        <title>{`${user.data?.firstName} ${user.data?.lastName} | WannaGo`}</title>
      </Head>
      <Container maxSize="sm">
        <div className="flex flex-col gap-y-4">
          <PageHeader title={pageHeaderTitle[settings]}>
            <div className="flex gap-2">
              <Button
                data-testid="personal-settings-button"
                onClick={() => router.push('/settings/personal')}
                size="sm"
                variant={settings === 'personal' ? 'primary' : 'neutral'}
              >
                Personal
              </Button>
              <Button
                data-testid="team-settings-button"
                onClick={() => router.push('/settings/team')}
                size="sm"
                variant={settings === 'team' ? 'primary' : 'neutral'}
              >
                Team
              </Button>
            </div>
          </PageHeader>
          {settings === 'personal' && (
            <div className="flex flex-col gap-4">
              <UserSettings />
              <UserSubscription />
            </div>
          )}
          {settings === 'team' && <TeamSettings />}
        </div>
      </Container>
    </>
  );
}

export default withProtected(SettingsPage);
