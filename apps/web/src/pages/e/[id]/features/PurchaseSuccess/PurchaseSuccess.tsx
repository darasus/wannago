import {CheckCircleIcon} from '@heroicons/react/24/solid';
import {useRouter} from 'next/router';
import {trpc} from 'trpc/src/trpc';
import {CardBase, LoadingBlock, PageHeader, Text} from 'ui';

export function PurchaseSuccess() {
  const router = useRouter();
  const tickets = trpc.payments.pollPurchasedTicket.useQuery({
    eventShortId: router.query.id as string,
  });

  if (tickets.isInitialLoading) {
    return <LoadingBlock />;
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-7 w-7 text-green-500" />
            <Text>You got your tickets!</Text>
          </div>
        }
      />
      <CardBase>
        {tickets.data?.map(ticketSale => {
          return (
            <div>{`${ticketSale.ticket.title} x${ticketSale.quantity}`}</div>
          );
        })}
      </CardBase>
    </div>
  );
}
