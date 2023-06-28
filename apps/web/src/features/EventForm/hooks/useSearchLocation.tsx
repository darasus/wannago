'use client';

import {useQuery} from '@tanstack/react-query';
import {useDebounce} from 'hooks';
import {api} from '../../../trpc/client';
import {useState} from 'react';

export function useSearchLocation() {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value);

  const result = useQuery({
    queryKey: ['searchPlaces', debouncedValue],
    queryFn: () =>
      api.maps.searchPlaces.query({
        query: debouncedValue,
      }),
    enabled: Boolean(debouncedValue),
  });

  return {result, setValue, value};
}
