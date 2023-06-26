import Head from 'next/head';
import {AddEventForm} from '../../features/EventForm/AddEventForm';
import {Button, Container, PageHeader} from 'ui';
import {SparklesIcon} from '@heroicons/react/24/solid';
import {useRouter} from 'next/navigation';

export default function EventAddPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Add event | WannaGo</title>
      </Head>
      <Container maxSize="sm" className="md:px-4">
        <PageHeader title="Create new event" className="mb-4">
          <Button
            iconLeft={<SparklesIcon className="text-brand-500" />}
            size="sm"
            variant="neutral"
            onClick={() => {
              router.push('/e/assistant');
            }}
          >{`I'm feeling lazy`}</Button>
        </PageHeader>
        <AddEventForm />
      </Container>
    </>
  );
}
