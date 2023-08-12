import {authMiddleware} from '@clerk/nextjs';
import {NextResponse} from 'next/server';

export default authMiddleware({
  signInUrl: '/login',
  async afterAuth(auth, req) {
    return NextResponse.next();
  },
});
