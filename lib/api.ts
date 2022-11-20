import {z} from 'zod';
import {Form} from '../components/EventForm/types';
import {EventOutput} from '../model';
import fetch from 'isomorphic-fetch';

export type EventOutputs = z.infer<typeof EventOutput>[];

function getMyEvents(userId: string) {
  return fetch(`http://localhost:3000/api/getMyEvents/${userId}`)
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
  return fetch(`http://localhost:3000/api/getEvent/${eventId}`)
    .then(res => res.json())
    .then(res => {
      if (res) {
        return EventOutput.parse(res);
      }
      return null;
    });
}

function createEvent(data: Form & {email: string}) {
  return fetch('/api/createEvent', {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(res => EventOutput.parse(res));
}

function editEvent(data: Form & {email: string; id: string}) {
  return fetch('/api/editEvent', {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(res => EventOutput.parse(res));
}

function deleteEvent(eventId: string) {
  return fetch('/api/deleteEvent', {
    method: 'POST',
    body: JSON.stringify({id: eventId}),
  })
    .then(res => res.json())
    .then(res => EventOutput.parse(res));
}

export const api = {getMyEvents, getEvent, createEvent, editEvent, deleteEvent};
