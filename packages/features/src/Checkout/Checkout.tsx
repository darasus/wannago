'use client';

import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {CheckoutForm} from './CheckoutForm';
import {Elements} from '@stripe/react-stripe-js';
import {Appearance, loadStripe, Stripe} from '@stripe/stripe-js';
import {useTheme} from 'next-themes';
import {Spinner} from 'ui';
import {env} from 'env/client';

interface Props {
  clientSecret: string;
  paymentIntentId: string;
  returnUrl: string;
}

export function Checkout({clientSecret, paymentIntentId, returnUrl}: Props) {
  const {resolvedTheme} = useTheme();
  const root = useRef(
    typeof document !== 'undefined' ? document.documentElement : null
  );
  const [variables, setVariables] = useState<Appearance['variables']>({});
  const [stripe, setStripe] = useState<Stripe | null>(null);

  const isLoading = !stripe || !clientSecret || !paymentIntentId;

  useEffect(() => {
    loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).then((stripe) => {
      if (stripe) {
        setStripe(stripe);
      }
    });
  }, []);

  useLayoutEffect(() => {
    if (root.current) {
      const radius = getComputedStyle(root.current).getPropertyValue(
        '--radius'
      );
      const background = getComputedStyle(root.current)
        .getPropertyValue('--background')
        .split(' ')
        .join(', ');
      const foreground = getComputedStyle(root.current)
        .getPropertyValue('--foreground')
        .split(' ')
        .join(', ');
      const primary = getComputedStyle(root.current)
        .getPropertyValue('--primary')
        .split(' ')
        .join(', ');

      setVariables((prevState) => {
        return {
          ...prevState,
          borderRadius: radius,
          colorBackground: `hsl(${background})`,
          colorText: `hsl(${foreground})`,
          colorPrimary: `hsl(${primary})`,
          fontFamily: '"Inter", sans-serif',
          fontWeightNormal: '600',
          fontSizeSm: '0.875rem',
        };
      });
    }
  }, [resolvedTheme]);

  return (
    <>
      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {paymentIntentId && clientSecret && stripe && (
        <Elements
          options={{
            clientSecret,
            appearance: {
              variables,
              rules: {
                '.Label': {
                  marginBottom: `0.5rem`,
                },
                '.Input::placeholder': {
                  fontWeight: 'normal',
                  fontSize: '0.875rem',
                },
              },
            },
          }}
          stripe={stripe}
        >
          <CheckoutForm returnUrl={returnUrl} />
        </Elements>
      )}
    </>
  );
}
