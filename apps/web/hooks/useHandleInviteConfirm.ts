import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {toast} from 'react-hot-toast';

export function useHandleInviteConfirm() {
  const {query, push} = useRouter();

  useEffect(() => {
    if (query.inviteConfirmed) {
      toast.success('You have successfully confirmed your attendance!', {
        duration: 10000,
      });
      push(`/e/${query.id}`, undefined, {shallow: true});
    }
  }, [query, push]);
}
