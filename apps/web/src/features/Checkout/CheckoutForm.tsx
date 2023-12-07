'use client';

import {
  PaymentElement,
  useStripe,
  useElements,
  LinkAuthenticationElement,
  AddressElement,
} from '@stripe/react-stripe-js';
import {useConfirmPayment} from './hooks/useConfirmPayment';
import {Button} from 'ui';

interface Props {
  returnUrl: string;
}

export function CheckoutForm({returnUrl}: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const {handleSubmit, isLoading, error} = useConfirmPayment({returnUrl});

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-2"
    >
      <LinkAuthenticationElement />
      <div className="border-b my-4" />
      <AddressElement
        options={{
          mode: 'shipping',
          autocomplete: {
            mode: 'automatic',
          },
        }}
      />
      <div className="border-b my-4" />
      <PaymentElement id="payment-element" />
      <Button
        className="w-full mt-2"
        disabled={isLoading || !stripe || !elements}
        id="submit"
      >
        {isLoading ? 'Paying...' : 'Pay now'}
      </Button>
      {error && <div id="payment-message">{error}</div>}
    </form>
  );
}
