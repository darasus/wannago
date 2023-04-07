import Link from 'next/link';
import {EventCard} from 'cards';
import Head from 'next/head';
import {Container, PageHeader, Toggle, LoadingBlock} from 'ui';
import {withProtected} from '../utils/withAuthProtect';
import {FormProvider, useForm} from 'react-hook-form';
import {useMyEventsQuery} from 'hooks';

interface Form {
  eventType: 'attending' | 'organizing' | 'all';
}

function Dashboard() {
  const form = useForm<Form>({
    defaultValues: {
      eventType: 'all',
    },
  });
  const eventType = form.watch('eventType');
  const {data, isLoading, isFetching} = useMyEventsQuery({eventType});
  const haveNoEvents = data?.length === 0;
  const isGettingCards = isLoading || isFetching;

  return (
    <>
      <Head>
        <title>Dashboard | WannaGo</title>
      </Head>
      <Container maxSize="sm" className="flex flex-col gap-y-4 md:px-4">
        <PageHeader title="My events">
          <FormProvider {...form}>
            <div className="flex items-center gap-x-2">
              <Toggle
                name="eventType"
                options={[
                  {label: 'All', value: 'all'},
                  {label: 'Attending', value: 'attending'},
                  {label: 'Organizing', value: 'organizing'},
                ]}
              />
            </div>
          </FormProvider>
        </PageHeader>
        {isGettingCards && <LoadingBlock />}
        {!isGettingCards && (
          <div className="flex flex-col gap-y-4">
            {data?.map(event => {
              return (
                <Link
                  href={`/e/${event.shortId}`}
                  key={event.id}
                  data-testid="event-card"
                >
                  <EventCard
                    event={event}
                    showPublishStatus={eventType === 'organizing'}
                  />
                </Link>
              );
            })}
          </div>
        )}
        {!isGettingCards && haveNoEvents && (
          <div className="text-center">
            <span className="text-5xl">🤷</span>
            <div />
            <span className="text-lg font-medium">
              {
                'It looks empty here, start by clicking on "+" button to create your first event.'
              }
            </span>
          </div>
        )}
      </Container>
    </>
  );
}

export default withProtected(Dashboard);
