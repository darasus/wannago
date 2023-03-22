import {OrganizationSwitcher, useUser} from '@clerk/nextjs';
import Head from 'next/head';
import {FormProvider, useForm} from 'react-hook-form';
import {Container, PageHeader, Text, Toggle} from 'ui';
import {CreateTeamSection} from '../features/TeamSettings/CreateTeamSection';
import {TeamSettings} from '../features/TeamSettings/TeamSettings';
import {EmailSettingsCard} from '../features/UserSettings/EmailSettingsCard';
import {NameSettingsCard} from '../features/UserSettings/NameSettingsCard';
import {ProfilePictureSettingsCard} from '../features/UserSettings/ProfilePictureSettingsCard';
import {withProtected} from '../utils/withAuthProtect';

interface Form {
  settingsType: 'personal' | 'team';
}

function ProfilePage() {
  const {user} = useUser();
  const form = useForm<Form>({
    defaultValues: {
      settingsType: 'personal',
    },
  });
  const settingsType = form.watch('settingsType');

  return (
    <>
      <Head>
        <title>{`${user?.fullName} | WannaGo`}</title>
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
              <OrganizationSwitcher />
            </>
          )}
          {settingsType === 'team' && (
            <>
              <CreateTeamSection />
              <TeamSettings />
            </>
          )}
        </div>
      </Container>
    </>
  );
}

export default withProtected(ProfilePage);
