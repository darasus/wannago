import {SignIn} from '@clerk/nextjs/app-beta';

export default function LoginPage() {
  return (
    <div className="flex justify-center">
      <SignIn />
    </div>
  );
}
