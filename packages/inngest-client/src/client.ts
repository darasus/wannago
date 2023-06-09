import {EventSchemas, Inngest, InngestMiddleware} from 'inngest';
import {prisma} from 'database';
import {Stripe, Postmark} from 'lib';
import {EventsStoreType} from './types';
import {payoutAvailableBalanceToConnectedAccount} from './actions/payoutAvailableBalanceToConnectedAccount';

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
