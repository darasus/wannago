import {createTRPCRouter} from '../../trpc';
import {signUp} from './signUp';
import {signIn} from './signIn';
import {verifyEmail} from './verifyEmail';
import {sendEmailVerificationEmail} from './sendEmailVerificationEmail';
import {sendPasswordResetEmail} from './sendPasswordResetEmail';
import {resetPassword} from './resetPassword';

export const authRouter = createTRPCRouter({
  signUp,
  signIn,
  verifyEmail,
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
  resetPassword,
});
