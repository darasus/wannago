import {createTRPCRouter} from './trpc';
import {mailRouter} from './routers/mail';
import {adminRouter} from './routers/admin';
import {organizationRouter} from './routers/organization';
import {conversationRouter} from './routers/conversation';
import {mapsRouter} from './routers/maps';
import {eventRouter} from './routers/event';
import {userRouter} from './routers/user';
import {authRouter} from './routers/auth';
import {paymentsRouter} from './routers/payments';
import {stripeAccountLinkRouter} from './routers/stripeAccountLink';

export const router = createTRPCRouter({
  maps: mapsRouter,
  mail: mailRouter,
  admin: adminRouter,
  organization: organizationRouter,
  conversation: conversationRouter,
  event: eventRouter,
  user: userRouter,
  auth: authRouter,
  payments: paymentsRouter,
  stripeAccountLink: stripeAccountLinkRouter,
});
