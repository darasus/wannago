import {EventSchemas, Inngest, InngestMiddleware, slugify} from 'inngest';
import {prisma} from 'database';
import {stripe} from 'lib/src/stripe';
import {resend} from 'lib/src/Resend';
import {EventsStoreType} from './types';
import {payoutAvailableBalanceToConnectedAccount} from './actions/payoutAvailableBalanceToConnectedAccount';
import {getNumberOfPurchasedTickets} from './actions/getNumberOfPurchasedTickets';
import {config} from 'config';

const middleware = new InngestMiddleware({
  name: 'Prisma Middleware',
  init() {
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
      config,
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
                resend,
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
