import Head from 'next/head';
import {FormProvider, useForm} from 'react-hook-form';
import {Container, LoadingBlock, PageHeader, Toggle} from 'ui';
import {TeamProfileForm} from '../features/TeamSettings/TeamProfileForm';
import {TeamMembersSettings} from '../features/TeamSettings/TeamMembersSettings';
import {UserSettings} from '../features/UserSettings/UserSettings';
import {withProtected} from '../utils/withAuthProtect';
import {useMyOrganizationQuery, useMyUserQuery} from 'hooks';

interface Form {
  settingsType: 'personal' | 'team';
}

function ProfilePage() {
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
            <FormProvider {...form}>
              <Toggle
                name="settingsType"
                options={[
                  {label: 'Personal', value: 'personal'},
                  {label: 'Team', value: 'team'},
                ]}
              />
            </FormProvider>
          </PageHeader>
          {settingsType === 'personal' && (
            <>
              <UserSettings />
            </>
          )}
          {settingsType === 'team' && (
            <>
              <TeamProfileForm />
              <TeamMembersSettings />
            </>
          )}
        </div>
      </Container>
    </>
  );
}

export default withProtected(ProfilePage);
