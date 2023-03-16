import {useUser} from '@clerk/nextjs';
import {useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {Badge, Button, CardBase, Text} from 'ui';
import {Input} from '../../components/Input/Input/Input';

type EmailForm = {
  email: string;
};

type CodeForm = {
  code: string;
};

export function EmailFormCard() {
  const [step, setStep] = useState(1);
  const {user} = useUser();
  const emailForm = useForm<EmailForm>();
  const verificationCodeForm = useForm<CodeForm>();
  const emailCreateAttemptRef = useRef<any>(null);

  const onEmailSubmit = emailForm.handleSubmit(async data => {
    try {
      const emailCreateAttempt = await user?.createEmailAddress({
        email: data.email,
      });
      await emailCreateAttempt?.prepareVerification({strategy: 'email_code'});
      emailCreateAttemptRef.current = emailCreateAttempt;
      setStep(2);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  });

  const onCodeSubmit = verificationCodeForm.handleSubmit(async data => {
    try {
      await emailCreateAttemptRef.current?.attemptVerification({
        code: data.code,
      });
      setStep(1);
      emailForm.reset();
      verificationCodeForm.reset();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  });

  return (
    <CardBase>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-2">
          {user?.emailAddresses.map(email => {
            const getColor = () => {
              if (!email.verification.status) {
                return 'gray';
              }

              if (email.verification.status === 'verified') {
                return 'green';
              }

              return 'gray';
            };

            const getLabel = () => {
              if (user.primaryEmailAddressId === email.id) {
                return 'primary';
              }

              if (!email.verification.status) {
                return 'unverified';
              }

              if (email.verification.status) {
                return email.verification.status;
              }

              return 'unknown';
            };

            const handleRemove = async () => {
              await email.destroy();
            };

            const handleMakePrimary = async () => {
              await user.update({primaryEmailAddressId: email.id});
            };

            const isPrimary = user.primaryEmailAddressId === email.id;

            return (
              <div key={email.id} className="flex items-center gap-x-2">
                <Text>{email.emailAddress}</Text>
                <Badge size="xs" color={getColor()}>
                  {getLabel()}
                </Badge>
                <div className="grow" />
                <Button
                  size="xs"
                  variant="neutral"
                  onClick={handleMakePrimary}
                  disabled={isPrimary}
                >
                  Make primary
                </Button>
                <Button
                  size="xs"
                  variant="danger"
                  onClick={handleRemove}
                  disabled={isPrimary}
                >
                  Delete
                </Button>
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div className="flex">
            <form
              className="flex grow items-end gap-4"
              onSubmit={onEmailSubmit}
            >
              <div className="grow">
                <Input
                  type="email"
                  label="Add new email"
                  {...emailForm.register(`email`)}
                />
              </div>
              <Button type="submit" disabled={emailForm.formState.isSubmitting}>
                Save
              </Button>
            </form>
          </div>
        )}
        {step === 2 && (
          <div className="flex">
            <form className="flex grow items-end gap-4" onSubmit={onCodeSubmit}>
              <div className="grow">
                <Input
                  type="number"
                  label="Verification code"
                  description="Enter the verification code sent to idarase+q3+clerk_test@gmail.com"
                  {...verificationCodeForm.register(`code`)}
                />
              </div>
              <Button
                type="submit"
                disabled={verificationCodeForm.formState.isSubmitting}
              >
                Submit
              </Button>
            </form>
          </div>
        )}
      </div>
    </CardBase>
  );
}
