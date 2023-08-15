import {createTRPCRouter} from './trpc';
import {mailRouter} from './routers/mail';
import {adminRouter} from './routers/admin';
import {organizationRouter} from './routers/organization';
import {conversationRouter} from './routers/conversation';
import {followRouter} from './routers/follow';
import {mapsRouter} from './routers/maps';
import {eventRouter} from './routers/event';
import {userRouter} from './routers/user';
import {authRouter} from './routers/auth';

export const edgeRouter = createTRPCRouter({
  maps: mapsRouter,
  mail: mailRouter,
  admin: adminRouter,
  organization: organizationRouter,
  follow: followRouter,
  conversation: conversationRouter,
  event: eventRouter,
  user: userRouter,
  auth: authRouter,
});
