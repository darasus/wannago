import {SignUp} from '@clerk/nextjs';
import AppLayout from '../components/AppLayout/AppLayout';

export default function RegisterPage() {
  return (
    <AppLayout>
      <div className="flex justify-center">
        <SignUp />
      </div>
    </AppLayout>
  );
}
