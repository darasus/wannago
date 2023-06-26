'use client';

import {FormProvider, useForm} from 'react-hook-form';
import {Button, CardBase, Toggle} from 'ui';
import {FileInput} from '../../../../components/Input/FileInput/FileInput';
import {Input} from '../../../../components/Input/Input/Input';
import {Currency} from '@prisma/client';
import {RouterOutputs} from 'api';
import {api} from '../../../../trpc/client';
import {useRouter} from 'next/navigation';
import {StripeAccountLinkSettings} from '../../../(features)/StripeAccountLinkSettings/StripeAccountLinkSettings';
import {UserSubscription} from './(features)/UserSubscription/UserSubscription';

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  currency: Currency;
  profileImageSrc: string;
}

interface Props {
  user: RouterOutputs['user']['me'];
  mySubscriptionPromise: Promise<
    RouterOutputs['subscriptionPlan']['getMySubscription']
  >;
}

export function UserSettings({user, mySubscriptionPromise}: Props) {
  const router = useRouter();
  const form = useForm<UserForm>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      profileImageSrc: user?.profileImageSrc || '',
      currency: user?.preferredCurrency || 'USD',
    },
  });

  const onSubmit = form.handleSubmit(async data => {
    if (user?.id) {
      await api.user.update.mutate({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        profileImageSrc: data.profileImageSrc,
        userId: user.id,
        currency: data.currency,
      });
      router.refresh();
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
        {user && (
          <UserSubscription
            user={user}
            mySubscriptionPromise={mySubscriptionPromise}
          />
        )}
        <StripeAccountLinkSettings type="PRO" />
      </div>
    </FormProvider>
  );
}
