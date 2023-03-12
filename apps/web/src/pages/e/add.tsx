import Head from 'next/head';
import {AddEventForm} from '../../features/EventForm/AddEventForm';
import {Container, PageHeader} from 'ui';
import {withProtected} from '../../utils/withAuthProtect';

function EventAddPage() {
  return (
    <>
      <Head>
        <title>Add event | WannaGo</title>
      </Head>
      <Container className="md:px-4">
        <PageHeader title="Create new event" className="mb-4" />
        <AddEventForm />
      </Container>
    </>
  );
}

export default withProtected(EventAddPage);
