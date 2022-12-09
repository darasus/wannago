import Head from 'next/head';
import AppLayout from '../../components/AppLayout/AppLayout';
import {AddEventForm} from '../../components/EventForm/AddEventForm';
import {Container} from '../../components/Container/Container';

export default function EventAddPage() {
  return (
    <>
      <Head>
        <title>Add event | WannaGo</title>
      </Head>
      <AppLayout>
        <Container className="md:px-4">
          <AddEventForm />
        </Container>
      </AppLayout>
    </>
  );
}
