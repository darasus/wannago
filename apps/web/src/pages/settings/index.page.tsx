import Head from 'next/head';
import {Container, LoadingBlock, PageHeader} from 'ui';
import {UserSettings} from './features/UserSettings/UserSettings';
import {withProtected} from '../../utils/withAuthProtect';
import {useMyUserQuery} from 'hooks';

function SettingsPage() {
  const user = useMyUserQuery();

  return (
    <>
      <Head>
        <title>{`${user.data?.firstName} ${user.data?.lastName} | WannaGo`}</title>
      </Head>
      <Container maxSize="sm">
        <div className="flex flex-col gap-y-4">
          <PageHeader title={'Settings'}></PageHeader>
          {user.isInitialLoading && <LoadingBlock />}
          {user.data && <UserSettings />}
        </div>
      </Container>
    </>
  );
}

export default withProtected(SettingsPage);
