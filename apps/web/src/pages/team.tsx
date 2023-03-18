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

function TeamPage() {
  const {user} = useUser();
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

  const removeOrganization = async () => {
    await organization?.destroy();
  };

  return (
    <>
      <Head>
        <title>{`Team | WannaGo`}</title>
      </Head>
      <Container maxSize="sm">
        <div className="flex flex-col gap-y-4">
          <PageHeader title="Team" />
          <CardBase>
            {organization && (
              <div>
                <Text className="font-bold">Team</Text>
                <div>
                  <div className="flex items-center">
                    <div className="grow">
                      <Text>{organization?.name}</Text>
                    </div>
                    <Button
                      variant="danger"
                      size="xs"
                      onClick={removeOrganization}
                    >
                      remove
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {!organization && (
              <Button onClick={createOrganization}>Create org</Button>
            )}
          </CardBase>
        </div>
      </Container>
    </>
  );
}

export default withProtected(TeamPage);
