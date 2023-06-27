import {createTRPCRouter} from './trpc';
import {eventRouter} from './routers/event';
import {mailRouter} from './routers/mail';
import {adminRouter} from './routers/admin';
import {userRouter} from './routers/user';
import {organizationRouter} from './routers/organization';
import {conversationRouter} from './routers/conversation';
import {followRouter} from './routers/follow';
import {mapsRouter} from './routers/maps';

export const edgeRouter = createTRPCRouter({
  event: eventRouter,
  maps: mapsRouter,
  mail: mailRouter,
  admin: adminRouter,
  user: userRouter,
  organization: organizationRouter,
  follow: followRouter,
  conversation: conversationRouter,
});
