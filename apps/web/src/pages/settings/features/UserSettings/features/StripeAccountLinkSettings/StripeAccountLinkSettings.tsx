import {useRouter} from 'next/router';
import {toast} from 'react-hot-toast';
import {trpc} from 'trpc/src/trpc';
import {Button, CardBase, LoadingBlock} from 'ui';

export function StripeAccountLinkSettings() {
  const router = useRouter();
  const account = trpc.stripeAccountLink.getLinkedAccount.useQuery();
  const createAccountLink =
    trpc.stripeAccountLink.createAccountLink.useMutation();
  const updateAccountLink =
    trpc.stripeAccountLink.updateAccountLink.useMutation();
  const deleteAccountLink =
    trpc.stripeAccountLink.deleteAccountLink.useMutation();

  const handleCreateAccountLink = async () => {
    const url = await createAccountLink.mutateAsync();
    router.push(url);
  };

  const handleDeleteAccountLink = async () => {
    const response = await deleteAccountLink.mutateAsync();
    if (response.success) {
      toast.success('Account link deleted.');
    } else {
      toast.error('Failed to delete account link.');
    }
  };

  const handleUpdateAccountLink = async () => {
    const url = await updateAccountLink.mutateAsync();
    window.open(url, '_blank');
  };

  if (account.isInitialLoading) {
    return (
      <CardBase>
        <LoadingBlock />
      </CardBase>
    );
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
        >
          Link Stripe account
        </Button>
      )}
    </CardBase>
  );
}
