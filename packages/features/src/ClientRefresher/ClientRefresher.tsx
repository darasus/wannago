'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

export function ClientRefresher() {
  const params = useSearchParams();
  const router = useRouter();

  const refresh = params.get('refresh');

  useEffect(() => {
    if (refresh === 'true') {
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return null;
}
