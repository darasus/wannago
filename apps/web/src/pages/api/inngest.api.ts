import {serve} from 'inngest/next';
import {EventSchemas, Inngest} from 'inngest';
import {EventsStoreType} from 'types';

const inngest = new Inngest({
  name: 'WannaGo',
  schemas: new EventSchemas().fromRecord<EventsStoreType>(),
});

const eventCreated = inngest.createFunction(
  {name: 'Event Created'},
  {event: 'event.created'},
  async ({event}) => {
    console.log(event);
  }
);

const eventUpdated = inngest.createFunction(
  {name: 'Event Updated'},
  {event: 'event.updated'},
  async ({event}) => {
    console.log(event);
  }
);

const eventPublished = inngest.createFunction(
  {name: 'Event Published'},
  {event: 'event.published'},
  async ({event}) => {
    console.log(event);
  }
);

const eventUnpublished = inngest.createFunction(
  {name: 'Event Unpublished'},
  {event: 'event.unpublished'},
  async ({event}) => {
    console.log(event);
  }
);

const eventRemoved = inngest.createFunction(
  {name: 'Event Removed'},
  {event: 'event.removed'},
  async ({event}) => {
    console.log(event);
  }
);

export default serve(inngest, [
  eventCreated,
  eventUpdated,
  eventPublished,
  eventUnpublished,
  eventRemoved,
]);
