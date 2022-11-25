import {Event} from '@prisma/client';
import {useCallback, useState} from 'react';
import {Form} from '../components/EventForm/types';
import {api} from '../lib/api';

interface Props {
  onSuccess?: (result: Event) => void;
}

export function useEditEvent({onSuccess}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleEdit = useCallback(
    async (data: Form & {email: string; id: string}) => {
      setIsLoading(true);

      try {
        const event = await api.editEvent(data);
        onSuccess?.(event);
        return event;
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {isLoading, handleEdit, error};
}
