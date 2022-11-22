import {SignUp} from '@clerk/nextjs';

export default function RegisterPage() {
  return (
    <div className="flex justify-center">
      <SignUp />
    </div>
  );
}
