import Link from 'next/link';
import {PlusCircleIcon} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import {trpc} from 'trpc/src/trpc';
import {EventCard} from 'cards';
import Head from 'next/head';
import {Container, Button, PageHeader, Toggle, LoadingBlock} from 'ui';
import {withProtected} from '../utils/withAuthProtect';
import {FormProvider, useForm} from 'react-hook-form';
import {useGlobalLoading} from 'hooks';
import {AnimatePresence, motion} from 'framer-motion';

interface Form {
  eventType: 'attending' | 'organizing';
}

function Dashboard() {
  const router = useRouter();
  const form = useForm<Form>({
    defaultValues: {
      eventType: 'attending',
    },
  });
  const eventType = form.watch('eventType');
  const {data, isLoading, isFetching} = trpc.me.getMyEvents.useQuery({
    eventType,
  });
  const haveNoEvents = data?.length === 0;
  const isGettingCards = isLoading || isFetching;

  useGlobalLoading(isGettingCards);

  return (
    <>
      <Head>
        <title>Dashboard | WannaGo</title>
      </Head>
      <Container maxSize="sm" className="flex flex-col gap-y-4 md:px-4">
        <PageHeader title="My events">
          <FormProvider {...form}>
            <div className="flex items-center gap-x-2">
              <Button
                size="md"
                onClick={() => router.push('/e/add')}
                iconLeft={<PlusCircleIcon />}
                data-testid="add-event-button"
              >
                <span className="hidden md:inline">Create event</span>
              </Button>
              <Toggle
                name="eventType"
                options={[
                  {label: 'Attending', value: 'attending'},
                  {label: 'Organizing', value: 'organizing'},
                ]}
              />
            </div>
          </FormProvider>
        </PageHeader>
        <AnimatePresence mode="wait">
          {isGettingCards && <LoadingBlock />}
          {!isGettingCards && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="flex flex-col gap-y-4"
            >
              {data?.map(event => {
                return (
                  <Link
                    href={`/e/${event.shortId}`}
                    key={event.id}
                    data-testid="event-card"
                  >
                    <EventCard event={event} />
                  </Link>
                );
              })}
            </motion.div>
          )}
          {!isGettingCards && haveNoEvents && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="text-center"
            >
              <span className="text-5xl">🤷</span>
              <div />
              <span className="text-lg font-medium">
                {
                  'It looks empty here, start by clicking on "+" button to create your first event.'
                }
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </>
  );
}

export default withProtected(Dashboard);
