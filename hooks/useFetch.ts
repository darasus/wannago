import {useCallback, useState} from 'react';

interface Props<T> {
  fetcher: () => Promise<T>;
}

export function useFetch<T>({fetcher}: Props<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T | null>(null);

  const handleFetch = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetcher();
      setData(response);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  return {isLoading, data, error};
}
