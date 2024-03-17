import {Suspense} from 'react';
import {UserType} from '@prisma/client';
import {notFound, redirect} from 'next/navigation';
import {Container, LoadingBlock, PageHeader} from 'ui';

import {api} from '../../../trpc/server-http';

import {AdminDashboard} from './features/AdminDashboard/AdminDashboard';
import {EventFilter} from './features/EventFilter';
import {EventsList} from './features/EventsList';

export default async function AdminPage() {
  const me = await api.user.me.query();

  if (!me) {
    redirect('/sign-in');
  }

  if (me?.type !== UserType.ADMIN) {
    notFound();
  }

  const events = api.event.getMyEvents.query();

  return (
    <Container className="flex flex-col gap-y-4 my-0 md:px-4">
      <Suspense fallback={<LoadingBlock />}>
        <AdminDashboard />
      </Suspense>
      <PageHeader title="Events">
        <EventFilter />
      </PageHeader>
      <Suspense fallback={<LoadingBlock />}>
        <EventsList events={events} eventType={''} />
      </Suspense>
    </Container>
  );
}
