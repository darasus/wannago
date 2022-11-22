import {UserProfile} from '@clerk/nextjs';

export default function RegisterPage() {
  return (
    <div className="flex justify-center">
      <UserProfile />
    </div>
  );
}
