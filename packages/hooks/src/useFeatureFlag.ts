import {useAuth} from '@clerk/nextjs';
import {useFlag} from '@upstash/edge-flags';
import {useMemo} from 'react';
import {useMe} from './useMe';

type FeatureFlag = 'test_feature';

export function useFeatureFlag(feature: FeatureFlag) {
  const {auth} = useMe();
  const attributes = useMemo(() => ({user_id: auth.userId || ''}), [auth]);
  const result = useFlag(feature, attributes);

  return useMemo(() => result, [result]);
}
