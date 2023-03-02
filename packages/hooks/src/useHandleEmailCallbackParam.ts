import {useRouter} from 'next/router';
import {useEffect, useMemo} from 'react';
import {toast} from 'react-hot-toast';
import {z} from 'zod';

const parseQuery = z
  .object({
    confirmInvite: z.string().optional(),
    cancelInvite: z.string().optional(),
    cancelSignUp: z.string().optional(),
    id: z.string().optional(),
  })
  .optional()
  .nullable();

export function useHandleEmailCallbackParam() {
  const {query, push} = useRouter();

  const q = useMemo(() => {
    return parseQuery.parse(query);
  }, [query]);

  useEffect(() => {
    if (q.confirmInvite === 'true') {
      toast.success('You have successfully confirmed your attendance!', {
        duration: 10000,
      });
    }

    if (q.cancelInvite === 'true') {
      toast.success('You have successfully cancelled your invite!', {
        duration: 10000,
      });
    }

    if (q.cancelSignUp === 'true') {
      toast.success('You have successfully cancelled your sign up!', {
        duration: 10000,
      });
    }

    if (
      (q.confirmInvite === 'true' ||
        q.cancelInvite === 'true' ||
        q.cancelSignUp === 'true') &&
      q.id
    ) {
      push(`/e/${q.id}`, undefined, {shallow: true});
    }
  }, [q, push]);
}
