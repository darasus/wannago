import {useAuth} from '@clerk/nextjs';
import {useFlag} from '@upstash/edge-flags';
import {useMemo} from 'react';

interface Props {
  feature: 'test_feature';
}

export function useFeatureFlag({feature}: Props) {
  const {userId} = useAuth();
  const result = useFlag(feature, {userId: userId || ''});

  return useMemo(() => result, [result]);
}
