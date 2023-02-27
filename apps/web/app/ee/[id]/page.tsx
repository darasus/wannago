import 'server-only';
import {trpcClient} from '../../../server/client';
import {cache, Suspense, use} from 'react';

const getEventByShortId = cache((id: string) => {
  return trpcClient.event.getByShortId.query({
    id,
  });
});

const getRandomExample = cache(() => {
  return trpcClient.event.getRandomExample.query();
});

export const revalidate = 60;

export default async function EventPage(props: {params: {id: string}}) {
  const event = await getEventByShortId(props.params.id);

  return (
    <>
      <div>{event?.title}</div>
      <Suspense fallback={<div>loading me...</div>}>
        <RandomExample />
      </Suspense>
    </>
  );
}

function RandomExample() {
  const event = use(getRandomExample());
  return <div>{event?.title}</div>;
}
