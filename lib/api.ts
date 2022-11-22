import {z} from 'zod';
import {Form} from '../components/EventForm/types';
import {EventOutput} from '../model';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return 'https://www.wannago.app';
  }

  const vercelUrl =
    process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

  if (vercelUrl?.startsWith('localhost')) {
    return `http://${vercelUrl}`;
  }

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return 'http://localhost:3000';
};

export type EventOutputs = z.infer<typeof EventOutput>[];

function getMyEvents(userId: string) {
  return fetch(`${getBaseUrl()}/api/getMyEvents`, {
    headers: {
      'x-user-id': userId,
    },
  })
    .then(res => res.json())
    .then((res: any) => {
      if (res) {
        return res.map((event: any) =>
          EventOutput.parse(event)
        ) as EventOutputs;
      }
      return null;
    });
}

function getEvent(eventId: string) {
  return fetch(`${getBaseUrl()}/api/getEvent/${eventId}`)
    .then(res => res.json())
    .then(res => {
      if (res) {
        return EventOutput.parse(res);
      }
      return null;
    });
}

function createEvent(data: Form & {email: string}) {
  return fetch(`${getBaseUrl()}/api/createEvent`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(res => EventOutput.parse(res));
}

function editEvent(data: Form & {email: string; id: string}) {
  return fetch(`${getBaseUrl()}/api/editEvent`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(res => EventOutput.parse(res));
}

function deleteEvent(eventId: string) {
  return fetch(`${getBaseUrl()}/api/deleteEvent`, {
    method: 'POST',
    body: JSON.stringify({id: eventId}),
  })
    .then(res => res.json())
    .then(res => EventOutput.parse(res));
}

export const api = {getMyEvents, getEvent, createEvent, editEvent, deleteEvent};
