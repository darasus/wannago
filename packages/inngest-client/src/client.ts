import {EventSchemas, Inngest, InngestMiddleware, slugify} from 'inngest';
import {prisma} from 'database';
import {stripe} from 'lib/src/stripe';
import {Postmark} from 'lib/src/postmark';
import {EventsStoreType} from './types';
import {payoutAvailableBalanceToConnectedAccount} from './actions/payoutAvailableBalanceToConnectedAccount';
import {getNumberOfPurchasedTickets} from './actions/getNumberOfPurchasedTickets';

const middleware = new InngestMiddleware({
  name: 'Prisma Middleware',
  init() {
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
  id: slugify('WannaGo'),
  schemas: new EventSchemas().fromRecord<EventsStoreType>(),
  middleware: [middleware],
});
