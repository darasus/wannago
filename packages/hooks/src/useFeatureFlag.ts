import {useAuth} from '@clerk/nextjs';
import {useFlag} from '@upstash/edge-flags';
import {useMemo} from 'react';

type FeatureFlag = 'test_feature';

export function useFeatureFlag(feature: FeatureFlag) {
  const {userId} = useAuth();
  const attributes = useMemo(() => ({user_id: userId || ''}), [userId]);
  const result = useFlag(feature, attributes);

  return useMemo(() => result, [result]);
}
