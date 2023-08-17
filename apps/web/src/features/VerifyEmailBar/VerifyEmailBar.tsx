import {
  Banner,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'ui';
import {api} from '../../trpc/server-http';
import {VerifyEmailForm} from './VerifyEmailForm';

export async function VerifyEmailBar() {
  const me = await api.user.me.query();

  if (!me) {
    return null;
  }

  if (me?.email_verified) {
    return null;
  }

  return (
    <Banner variant="warning">
      Please verify your email.{' '}
      <Dialog>
        <DialogTrigger asChild>
          <Button size={'sm'} variant={'link'} className="p-0 underline">
            Verify
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify email</DialogTitle>
            <DialogDescription>
              {`We've sent an email to ${me?.email} with verification code.`}
            </DialogDescription>
          </DialogHeader>
          <VerifyEmailForm />
        </DialogContent>
      </Dialog>
    </Banner>
  );
}
