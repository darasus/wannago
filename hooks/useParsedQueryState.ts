'use client';

import {useSearchParams} from 'next/navigation';
import {useMemo} from 'react';

export function useParsedQueryState<T extends object>() {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');
  const parsedData = useMemo(
    () =>
      data
        ? (JSON.parse(atob(decodeURIComponent(data))).data as Partial<T>)
        : null,
    [data]
  );

  return parsedData;
}
