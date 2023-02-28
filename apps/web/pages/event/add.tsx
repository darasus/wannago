import Head from 'next/head';
import AppLayout from '../../features/AppLayout/AppLayout';
import {AddEventForm} from '../../features/EventForm/AddEventForm';
import {Container, PageHeader} from 'ui';
import {withProtected} from '../../utils/withAuthProtect';

function EventAddPage() {
  return (
    <>
      <Head>
        <title>Add event | WannaGo</title>
      </Head>
      <AppLayout>
        <Container className="md:px-4">
          <PageHeader title="Create new event" className="mb-4" />
          <AddEventForm />
        </Container>
      </AppLayout>
    </>
  );
}

export default withProtected(EventAddPage);
