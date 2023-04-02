import {useMyUserQuery, useUpdateUserMutation} from 'hooks';
import Link from 'next/link';
import {FormProvider, useForm} from 'react-hook-form';
import {trpc} from 'trpc/src/trpc';
import {Button, CardBase, Text} from 'ui';
import {FileInput} from '../../components/Input/FileInput/FileInput';
import {Input} from '../../components/Input/Input/Input';

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  profileImageSrc: string;
}

export function UserSettings() {
  const subscription = trpc.subscription.createProSubscriptionLink.useQuery();
  const mySubscription = trpc.subscription.getMySubscription.useQuery();
  const user = useMyUserQuery();
  const updateUser = useUpdateUserMutation();
  const form = useForm<UserForm>({
    defaultValues: {
      firstName: user.data?.firstName || '',
      lastName: user.data?.lastName || '',
      email: user.data?.email || '',
      profileImageSrc: user.data?.profileImageSrc || '',
    },
  });

  const onSubmit = form.handleSubmit(async data => {
    if (user.data?.id) {
      await updateUser.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        profileImageSrc: data.profileImageSrc,
        userId: user.data.id,
      });
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <CardBase>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-y-4">
            <div>
              <Input
                type="text"
                label="First name"
                {...form.register('firstName', {
                  required: {
                    value: true,
                    message: 'First name is required',
                  },
                })}
                data-testid="first-name-input"
              />
            </div>
            <div>
              <Input
                type="text"
                label="Last name"
                {...form.register('lastName', {
                  required: {
                    value: true,
                    message: 'Last name is required',
                  },
                })}
                data-testid="last-name-input"
              />
            </div>
            <div>
              <Input
                type="email"
                label="Email"
                {...form.register('email', {
                  required: {
                    value: true,
                    message: 'Email is required',
                  },
                })}
                data-testid="email-input"
                disabled
              />
            </div>
            <div>
              <FormProvider {...form}>
                <FileInput {...form.register('profileImageSrc')} />
              </FormProvider>
            </div>
            <div>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                data-testid="user-settings-submit-button"
                isLoading={form.formState.isSubmitting}
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </CardBase>
      <CardBase>
        <Button as="a" href={subscription.data?.url || ''}>
          Become pro
        </Button>
      </CardBase>
      {mySubscription.data && (
        <CardBase>
          <div>
            <Text>{mySubscription.data.subscription?.type}</Text>
            <Button as="a" href={mySubscription.data.customerPortalUrl}>
              Update billing
            </Button>
          </div>
        </CardBase>
      )}
    </div>
  );
}
