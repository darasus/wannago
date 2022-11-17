import {SignUp} from '@clerk/nextjs/app-beta';

export default function RegisterPage() {
  return (
    <div className="flex justify-center">
      <SignUp />
    </div>
  );
}
