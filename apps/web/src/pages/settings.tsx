import Head from 'next/head';
import {FormProvider, useForm} from 'react-hook-form';
import {Container, PageHeader, Toggle} from 'ui';
import {TeamProfileForm} from '../features/TeamSettings/TeamProfileForm';
import {TeamMembersSettings} from '../features/TeamSettings/TeamMembersSettings';
import {EmailSettingsCard} from '../features/UserSettings/EmailSettingsCard';
import {NameSettingsCard} from '../features/UserSettings/NameSettingsCard';
import {ProfilePictureSettingsCard} from '../features/UserSettings/ProfilePictureSettingsCard';
import {withProtected} from '../utils/withAuthProtect';
import {useMyOrganizationQuery, useMyUser} from 'hooks';

interface Form {
  settingsType: 'personal' | 'team';
}

function ProfilePage() {
  // INFO: just prefetching
  useMyOrganizationQuery();
  const user = useMyUser();
  const form = useForm<Form>({
    defaultValues: {
      settingsType: 'personal',
    },
  });
  const settingsType = form.watch('settingsType');

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
              <NameSettingsCard />
              <ProfilePictureSettingsCard />
              <EmailSettingsCard />
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
