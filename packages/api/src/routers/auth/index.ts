import {createTRPCRouter} from '../../trpc';
import {signUp} from './signUp';
import {signIn} from './signIn';

export const authRouter = createTRPCRouter({
  signUp,
  signIn,
});
