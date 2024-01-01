'use client';

import {useDebounce} from 'hooks';
import {api} from '../../../../../apps/web/src/trpc/client';
import {useEffect, useState, useTransition} from 'react';
import type {PlaceAutocompleteResponseData} from '@googlemaps/google-maps-services-js';

export function useSearchLocation() {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState<string>('');
  const debouncedValue = useDebounce(value);
  const [state, setState] = useState<PlaceAutocompleteResponseData | null>(
    null
  );

  useEffect(() => {
    if (debouncedValue) {
      startTransition(async () => {
        await api.maps.searchPlaces
          .query({
            query: debouncedValue,
          })
          .then((res) => {
            setState(res);
          });
      });
    }
  }, [debouncedValue]);

  return {predictions: state?.predictions, setValue, value, isPending};
}
