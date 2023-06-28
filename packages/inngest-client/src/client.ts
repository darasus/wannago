import {EventSchemas, Inngest, InngestMiddleware} from 'inngest';
import {prisma} from 'database';
import {Stripe} from 'lib/src/stripe';
import {Postmark} from 'lib/src/postmark';
import {EventsStoreType} from './types';
import {payoutAvailableBalanceToConnectedAccount} from './actions/payoutAvailableBalanceToConnectedAccount';
import {getNumberOfPurchasedTickets} from './actions/getNumberOfPurchasedTickets';

const middleware = new InngestMiddleware({
  name: 'Prisma Middleware',
  init() {
    const stripe = new Stripe().client;
    const postmark = new Postmark();

    const actions = {
      payoutAvailableBalanceToConnectedAccount:
        payoutAvailableBalanceToConnectedAccount({
          ctx: {
            stripe,
            prisma,
          },
        }),
      getNumberOfPurchasedTickets: getNumberOfPurchasedTickets({
        ctx: {
          stripe,
          prisma,
        },
      }),
    };

    return {
      onFunctionRun(ctx) {
        return {
          transformInput(ctx) {
            return {
              ctx: {
                prisma,
                stripe,
                actions,
                postmark,
              },
            };
          },
        };
      },
    };
  },
});

export const inngest = new Inngest({
  name: 'WannaGo',
  schemas: new EventSchemas().fromRecord<EventsStoreType>(),
  middleware: [middleware],
});
