import {buildClerkProps} from '@clerk/nextjs/server';
import {NextRequest} from 'next/server';
import {AddEventForm} from '../../components/EventForm/AddEventForm';

export default function EventAddPage() {
  return <AddEventForm />;
}

export async function getServerSideProps({req}: {req: NextRequest}) {
  return {
    props: {...buildClerkProps(req)},
  };
}
