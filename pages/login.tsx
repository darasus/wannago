import {SignIn} from '@clerk/nextjs';
import AppLayout from '../components/AppLayout/AppLayout';

export default function LoginPage() {
  return (
    <AppLayout>
      <div className="flex justify-center">
        <SignIn />
      </div>
    </AppLayout>
  );
}
