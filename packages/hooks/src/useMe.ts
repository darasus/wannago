import {use} from 'react';
import {api} from '../../../apps/web/src/trpc/client';

export function useMe() {
  return use(api.user.me.query().catch(() => null));
}
