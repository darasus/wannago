import {useMe} from 'hooks';
import {
  useOrganization,
  useUser,
  useOrganizations,
  useOrganizationList,
} from '@clerk/nextjs';
import Head from 'next/head';
import {useEffect} from 'react';
import {Button, CardBase, Container, PageHeader, Text} from 'ui';
import {EmailSettingsCard} from '../features/UserSettings/EmailSettingsCard';
import {NameSettingsCard} from '../features/UserSettings/NameSettingsCard';
import {ProfilePictureSettingsCard} from '../features/UserSettings/ProfilePictureSettingsCard';
import {withProtected} from '../utils/withAuthProtect';

function ProfilePage() {
  const {clerkMe} = useMe();
  const {organization} = useOrganization({
    invitationList: {
      limit: 100,
      offset: 0,
    },
    membershipList: {
      limit: 100,
      offset: 0,
    },
  });

  const {createOrganization: _createOrganization} = useOrganizations();
  const {setActive} = useOrganizationList();

  const createOrganization = async () => {
    const result = await _createOrganization?.({
      name: 'test',
      slug: 'test',
    });
    await setActive?.({
      organization: result?.id,
    });
  };

  return (
    <>
      <Head>
        <title>{`${clerkMe?.fullName} | WannaGo`}</title>
      </Head>
      <Container maxSize="sm">
        <div className="flex flex-col gap-y-4">
          <PageHeader title="Settings" />
          <NameSettingsCard />
          <ProfilePictureSettingsCard />
          <EmailSettingsCard />
          <CardBase>
            {organization && (
              <div>
                <div>
                  <div>
                    <Text>{organization?.name}</Text>
                    <Text>{organization?.logoUrl}</Text>
                  </div>
                  {/* <div>{organization.getMemberships()}</div> */}
                </div>
              </div>
            )}
            <Button onClick={createOrganization}>Create org</Button>
          </CardBase>
        </div>
      </Container>
    </>
  );
}

export default withProtected(ProfilePage);
