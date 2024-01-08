import {createTRPCRouter} from './trpc';
import {mailRouter} from './routers/mail';
import {adminRouter} from './routers/admin';
import {mapsRouter} from './routers/maps';
import {eventRouter} from './routers/event';
import {userRouter} from './routers/user';
import {authRouter} from './routers/auth';
import {paymentsRouter} from './routers/payments';

export const router = createTRPCRouter({
  maps: mapsRouter,
  mail: mailRouter,
  admin: adminRouter,
  event: eventRouter,
  user: userRouter,
  auth: authRouter,
  payments: paymentsRouter,
});
