import {useMyUserQuery, useUpdateUserMutation} from 'hooks';
import {FormProvider, useForm} from 'react-hook-form';
import {Button, CardBase, Toggle} from 'ui';
import {FileInput} from '../../../../components/Input/FileInput/FileInput';
import {Input} from '../../../../components/Input/Input/Input';
import {UserSubscription} from './features/UserSubscription/UserSubscription';
import {StripeAccountLinkSettings} from '../StripeAccountLinkSettings/StripeAccountLinkSettings';
import {Currency} from '@prisma/client';

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  currency: Currency;
  profileImageSrc: string;
}

export function UserSettings() {
  const user = useMyUserQuery();
  const updateUser = useUpdateUserMutation();
  const form = useForm<UserForm>({
    defaultValues: {
      firstName: user.data?.firstName || '',
      lastName: user.data?.lastName || '',
      email: user.data?.email || '',
      profileImageSrc: user.data?.profileImageSrc || '',
      currency: user.data?.preferredCurrency || 'USD',
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
        currency: data.currency,
      });
    }
  });

  return (
    <FormProvider {...form}>
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
                  error={form.formState.errors.firstName}
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
                  error={form.formState.errors.lastName}
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
                  error={form.formState.errors.email}
                />
              </div>
              <div>
                <FormProvider {...form}>
                  <FileInput
                    {...form.register('profileImageSrc')}
                    error={form.formState.errors.profileImageSrc}
                  />
                </FormProvider>
              </div>
              <div>
                <Toggle
                  options={[
                    {label: 'USD', value: 'USD'},
                    {label: 'EUR', value: 'EUR'},
                    {label: 'GBP', value: 'GBP'},
                  ]}
                  label="Default Currency"
                  {...form.register('currency')}
                  data-testid="email-input"
                  error={form.formState.errors.currency}
                />
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
        <UserSubscription />
        <StripeAccountLinkSettings type="PRO" />
      </div>
    </FormProvider>
  );
}
