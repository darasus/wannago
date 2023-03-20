import Head from 'next/head';
import {Container, PageHeader} from 'ui';
import {CreateTeamSection} from '../features/TeamSettings/CreateTeamSection';
import {TeamSettings} from '../features/TeamSettings/TeamSettings';
import {withProtected} from '../utils/withAuthProtect';

function TeamPage() {
  return (
    <>
      <Head>
        <title>{`Team settings | WannaGo`}</title>
      </Head>
      <Container maxSize="sm">
        <div className="flex flex-col gap-y-4">
          <PageHeader title="Team settings" />
          <CreateTeamSection />
          <TeamSettings />
          {/* <OrganizationProfile /> */}
        </div>
      </Container>
    </>
  );
}

export default withProtected(TeamPage);
