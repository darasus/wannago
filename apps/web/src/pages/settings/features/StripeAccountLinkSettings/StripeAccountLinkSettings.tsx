import {useSubscription} from 'hooks';
import {useRouter} from 'next/router';
import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {Button, CardBase, LoadingBlock} from 'ui';

interface Props {
  type: 'PRO' | 'BUSINESS';
}

export function StripeAccountLinkSettings({type}: Props) {
  const router = useRouter();
  const {subscription} = useSubscription({type});
  const account = trpc.stripeAccountLink.getLinkedAccount.useQuery(
    {
      type,
    },
    {
      keepPreviousData: false,
      refetchOnMount: true,
    }
  );
  const createAccountLink =
    trpc.stripeAccountLink.createAccountLink.useMutation({
      onError: error => {
        toast.error(error.message);
      },
    });
  const updateAccountLink =
    trpc.stripeAccountLink.updateAccountLink.useMutation({
      onError: error => {
        toast.error(error.message);
      },
    });
  const deleteAccountLink =
    trpc.stripeAccountLink.deleteAccountLink.useMutation({
      onError: error => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        await account.refetch();
      },
    });

  const handleCreateAccountLink = async () => {
    try {
      const url = await createAccountLink.mutateAsync();
      router.push(url);
    } catch (error) {}
  };

  const handleDeleteAccountLink = async () => {
    try {
      const response = await deleteAccountLink.mutateAsync();
      if (response.success) {
        toast.success('Account link deleted.');
      } else {
        toast.error('Failed to delete account link.');
      }
    } catch (error) {}
  };

  const handleUpdateAccountLink = async () => {
    try {
      const url = await updateAccountLink.mutateAsync();
      window.open(url, '_blank');
    } catch (error) {}
  };

  if (account.isInitialLoading) {
    return (
      <CardBase>
        <LoadingBlock />
      </CardBase>
    );
  }

  if (subscription.data?.type !== type) {
    return null;
  }

  return (
    <CardBase
      title={account.data ? 'Linked Stripe account' : 'Link Stripe account'}
    >
      {account.data && (
        <div className="flex flex-col gap-2">
          <div>
            <div>Account ID: {account.data.id}</div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleUpdateAccountLink}
              isLoading={updateAccountLink.isLoading}
              size="sm"
            >
              View account
            </Button>
            <Button
              onClick={handleDeleteAccountLink}
              isLoading={deleteAccountLink.isLoading}
              size="sm"
              variant="danger"
            >
              Delete account
            </Button>
          </div>
        </div>
      )}
      {!account.data && (
        <Button
          onClick={handleCreateAccountLink}
          isLoading={createAccountLink.isLoading}
          size="sm"
        >
          Link Stripe account
        </Button>
      )}
    </CardBase>
  );
}
