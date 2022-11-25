import {Event} from '@prisma/client';
import {useCallback, useState} from 'react';
import {Form} from '../components/EventForm/types';
import {api} from '../lib/api';

interface Props {
  onSuccess?: (result: Event) => void;
}

export function useCreateEvent({onSuccess}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleCreate = useCallback(
    async (data: Form & {email: string}) => {
      setIsLoading(true);

      try {
        const event = await api.createEvent(data);
        onSuccess?.(event);
        return event;
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess]
  );

  return {isLoading, handleCreate, error};
}
