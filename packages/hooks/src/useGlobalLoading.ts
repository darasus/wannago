'use client';

import {useEffect} from 'react';
import {create} from 'zustand';

interface LoadingState {
  enabled: boolean;
  set: (enabled: boolean) => void;
}

export const useLoading = create<LoadingState>(set => ({
  enabled: false,
  set: enabled => set(state => ({enabled})),
}));

export function useGlobalLoading(isLoading: boolean) {
  const {set} = useLoading();

  useEffect(() => {
    set(isLoading);
  }, [isLoading, set]);
}
