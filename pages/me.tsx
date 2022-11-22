import {UserProfile} from '@clerk/nextjs';
import {clerkAppearance} from '../clerkElements';
import AppLayout from '../components/AppLayout/AppLayout';

export default function RegisterPage() {
  return (
    <AppLayout>
      <div className="flex justify-center">
        <UserProfile appearance={clerkAppearance} />
      </div>
    </AppLayout>
  );
}
