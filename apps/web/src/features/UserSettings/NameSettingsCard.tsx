import {useMe} from 'hooks';
import {useForm} from 'react-hook-form';
import {Button, CardBase} from 'ui';
import {Input} from '../../components/Input/Input/Input';

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
}

export function NameSettingsCard() {
  const {clerkMe} = useMe();
  const form = useForm<UserForm>({
    defaultValues: {
      firstName: clerkMe?.firstName!,
      lastName: clerkMe?.lastName!,
      email: clerkMe?.primaryEmailAddress?.emailAddress!,
    },
  });

  const onSubmit = form.handleSubmit(async data => {
    await clerkMe?.update({
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
              data-testid="first-name-input"
            />
          </div>
          <div>
            <Input
              type="text"
              label="Last name"
              {...form.register('lastName')}
              data-testid="last-name-input"
            />
          </div>
          <div>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              data-testid="name-settings-submit-button"
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </CardBase>
  );
}
