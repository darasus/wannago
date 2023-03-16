import {useUser} from '@clerk/nextjs';
import {useForm} from 'react-hook-form';
import {Button, CardBase} from 'ui';
import {Input} from '../../components/Input/Input/Input';

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
}

export function NameFormCard() {
  const {user} = useUser();
  const form = useForm<UserForm>({
    defaultValues: {
      firstName: user?.firstName!,
      lastName: user?.lastName!,
      email: user?.primaryEmailAddress?.emailAddress!,
    },
  });

  const onSubmit = form.handleSubmit(async data => {
    await user?.update({
      firstName: data.firstName,
      lastName: data.lastName,
    });
  });

  return (
    <CardBase>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-y-4">
          <div>
            <Input
              type="text"
              label="First name"
              {...form.register('firstName')}
            />
          </div>
          <div>
            <Input
              type="text"
              label="Last name"
              {...form.register('lastName')}
            />
          </div>
          <div>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </CardBase>
  );
}
