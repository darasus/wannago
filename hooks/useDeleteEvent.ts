import {Event} from '@prisma/client';
import {useCallback, useState} from 'react';
import {api} from '../lib/api';

interface Props {
  onSuccess?: (result: Event) => void;
}

export function useDeleteEvent({onSuccess}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleDelete = useCallback(async (eventId: string) => {
    setIsLoading(true);

    try {
      const event = await api.deleteEvent(eventId);
      onSuccess?.(event);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {isLoading, handleDelete, error};
}
