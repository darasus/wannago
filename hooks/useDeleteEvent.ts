export const useDeleteEvent = (eventId: string) => {
  const deleteEvent = () => {
    return fetch('/api/deleteEvent', {
      method: 'POST',
      body: JSON.stringify({id: eventId}),
    });
  };

  return {deleteEvent};
};
