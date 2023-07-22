import {Register} from './features/Register/Register';

export const metadata = {
  title: 'Register | WannaGo',
};

export const runtime = 'nodejs';
export const preferredRegion = 'iad1';

export default function RegisterPage() {
  return <Register />;
}
