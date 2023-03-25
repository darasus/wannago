import Head from 'next/head';
import {FormProvider, useForm} from 'react-hook-form';
import {Container, LoadingBlock, PageHeader, Toggle} from 'ui';
import {TeamSettings} from '../features/TeamSettings/TeamSettings';
import {UserSettings} from '../features/UserSettings/UserSettings';
import {withProtected} from '../utils/withAuthProtect';
import {useFlag, useMyOrganizationQuery, useMyUserQuery} from 'hooks';
import {useAuth} from '@clerk/nextjs';

interface Form {
  settingsType: 'personal' | 'team';
}

function SettingsPage() {
  const auth = useAuth();
  const organizationFeatureEnabled = useFlag('organization_feature', {
    user_id: auth.userId ?? '',
  });
  const organization = useMyOrganizationQuery();
  const user = useMyUserQuery();
  const form = useForm<Form>({
    defaultValues: {
      settingsType: 'personal',
    },
  });
  const settingsType = form.watch('settingsType');

  if (
    (user.isLoading || organization.isLoading) &&
    (!user.data || !organization.data)
  ) {
    return <LoadingBlock />;
  }

  return (
    <>
      <Head>
        <title>{`${user.data?.firstName} ${user.data?.lastName} | WannaGo`}</title>
      </Head>
      <Container maxSize="sm">
        <div className="flex flex-col gap-y-4">
          <PageHeader title="Settings">
            {organizationFeatureEnabled.isEnabled && (
              <FormProvider {...form}>
                <Toggle
                  name="settingsType"
                  options={[
                    {label: 'Personal', value: 'personal'},
                    {label: 'Team', value: 'team'},
                  ]}
                />
              </FormProvider>
            )}
          </PageHeader>
          {settingsType === 'personal' && <UserSettings />}
          {settingsType === 'team' && <TeamSettings />}
        </div>
      </Container>
    </>
  );
}

export default withProtected(SettingsPage);
