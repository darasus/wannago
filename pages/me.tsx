import {UserProfile} from '@clerk/nextjs';
import {clerkAppearance} from '../clerkElements';

export default function RegisterPage() {
  return (
    <div className="flex justify-center">
      <UserProfile appearance={clerkAppearance} />
    </div>
  );
}
