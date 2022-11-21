import {z} from 'zod';
import {Form} from '../components/EventForm/types';
import {EventOutput} from '../model';
import axios from 'axios';

const baseUrl = process.env.VERCEL_URL?.startsWith('localhost')
  ? `http://${process.env.VERCEL_URL}`
  : `https://${process.env.VERCEL_URL}`;

export type EventOutputs = z.infer<typeof EventOutput>[];

function getMyEvents(userId: string) {
  return axios(`${baseUrl}/api/getMyEvents/${userId}`)
    .then(res => res.data)
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
  return axios(`${baseUrl}/api/getEvent/${eventId}`)
    .then(res => res.data)
    .then(res => {
      if (res) {
        return EventOutput.parse(res);
      }
      return null;
    });
}

function createEvent(data: Form & {email: string}) {
  return axios(`${baseUrl}/api/createEvent`, {
    method: 'POST',
    data,
  })
    .then(res => res.data)
    .then(res => EventOutput.parse(res));
}

function editEvent(data: Form & {email: string; id: string}) {
  return axios(`${baseUrl}/api/editEvent`, {
    method: 'POST',
    data,
  })
    .then(res => res.data)
    .then(res => EventOutput.parse(res));
}

function deleteEvent(eventId: string) {
  return axios(`${baseUrl}/api/deleteEvent`, {
    method: 'POST',
    data: {id: eventId},
  })
    .then(res => res.data)
    .then(res => EventOutput.parse(res));
}

export const api = {getMyEvents, getEvent, createEvent, editEvent, deleteEvent};
