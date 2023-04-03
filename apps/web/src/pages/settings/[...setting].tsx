import Head from 'next/head';
import {Button, Container, LoadingBlock, PageHeader} from 'ui';
import {TeamSettings} from '../../features/TeamSettings/TeamSettings';
import {UserSettings} from '../../features/UserSettings/UserSettings';
import {withProtected} from '../../utils/withAuthProtect';
import {useMyOrganizationQuery, useMyUserQuery} from 'hooks';
import {useRouter} from 'next/router';
import {UserSubscription} from '../../features/UserSubscription/UserSubscription';

type SettingsPageType = 'personal' | 'team';

function SettingsPage() {
  const router = useRouter();
  const setting = (router.query.setting as string[]).join(
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
          <PageHeader title={pageHeaderTitle[setting]}>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push('/settings/personal')}
                size="sm"
                variant={setting === 'personal' ? 'primary' : 'neutral'}
              >
                Personal
              </Button>
              <Button
                onClick={() => router.push('/settings/team')}
                size="sm"
                variant={setting === 'team' ? 'primary' : 'neutral'}
              >
                Team
              </Button>
            </div>
          </PageHeader>
          {setting === 'personal' && (
            <div className="flex flex-col gap-4">
              <UserSettings />
              <UserSubscription />
            </div>
          )}
          {setting === 'team' && <TeamSettings />}
        </div>
      </Container>
    </>
  );
}

export default withProtected(SettingsPage);
