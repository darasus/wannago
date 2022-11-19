import {EventOutput} from '../model';

export const useDeleteEvent = (eventId: string) => {
  const deleteEvent = async () => {
    const response = await fetch('/api/deleteEvent', {
      method: 'POST',
      body: JSON.stringify({id: eventId}),
    }).then(res => res.json());

    const event = EventOutput.parse(response);

    return event;
  };

  return {deleteEvent};
};
