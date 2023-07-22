import {Login} from './features/Login/Login';

export const metadata = {
  title: 'Login | WannaGo',
};

export const runtime = 'nodejs';
export const preferredRegion = 'iad1';

export default function LoginPage() {
  return <Login />;
}
