import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Text,
} from 'ui';
import {Checkout} from 'features/src/Checkout/Checkout';
import {api} from '../../../trpc/server-http';
import {notFound, redirect} from 'next/navigation';
import {formatCents, getConfig} from 'utils';
import {Countdown} from 'features/src/Countdown/Countdown';
import Link from 'next/link';

export default async function CheckoutPage(props: any) {
  const result = await api.payments.getCheckoutSession
    .mutate({
      checkoutSessionId: props?.params?.checkoutSessionId,
    })
    .catch(() => {
      return null;
    });

  if (!result) {
    notFound();
  }

  const totalCents = result.ticketSales.reduce((acc, ticketSale) => {
    return acc + ticketSale.quantity * ticketSale.ticket.price;
  }, 0);

  return (
    <Container maxSize="sm" className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Checkout
            <Countdown
              expires={result.expires.getTime()}
              onDone={async () => {
                'use server';
                redirect(`/e/${result.event.shortId}`);
              }}
            />
          </CardTitle>
          <CardDescription>
            <Link href={`/e/${result.event.shortId}`} className="underline">
              {result.event.title}
            </Link>
            {` by `}
            <Link href={'/'} className="underline">
              {getConfig().name}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result.ticketSales.map((ticketSale) => {
            return (
              <div key={ticketSale.id}>
                <div className="flex gap-2">
                  <Text>{ticketSale.ticket.title}</Text>
                  <div className="grow" />
                  <Text>{`Quantity: ${ticketSale.quantity}`}</Text>
                  <Text>{`Price: ${formatCents(
                    ticketSale.ticket.price,
                    result.event.preferredCurrency
                  )}`}</Text>
                </div>
              </div>
            );
          })}
          <div className="h-[1px] bg-secondary my-2" />
          <div className="flex">
            <div className="grow" />
            <Text>{`Total: ${formatCents(
              totalCents,
              result.event.preferredCurrency
            )}`}</Text>
          </div>
        </CardContent>
      </Card>
      <Card>
        <div className="h-6" />
        <CardContent>
          <Checkout
            returnUrl={result.returnUrl}
            clientSecret={result.clientSecret}
            paymentIntentId={result.id}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
