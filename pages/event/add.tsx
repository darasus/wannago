import Head from 'next/head';
import AppLayout from '../../components/AppLayout/AppLayout';
import {AddEventForm} from '../../components/EventForm/AddEventForm';

export default function EventAddPage() {
  return (
    <>
      <Head>
        <title>Add event | WannaGo</title>
      </Head>
      <AppLayout>
        <AddEventForm />
      </AppLayout>
    </>
  );
}
