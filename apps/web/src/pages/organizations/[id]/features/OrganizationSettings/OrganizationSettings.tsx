import {FormProvider, useForm} from 'react-hook-form';
import {CardBase, Toggle, Button} from 'ui';
import {FileInput} from '../../../../../components/Input/FileInput/FileInput';
import {Input} from '../../../../../components/Input/Input/Input';
import {StripeAccountLinkSettings} from '../../../../settings/features/StripeAccountLinkSettings/StripeAccountLinkSettings';
import {OrganizationSubscription} from '../OrganizationSubscription/OrganizationSubscription';
import {TeamMembersSettings} from '../TeamMemberSettings/TeamMembersSettings';
import {useCreateOrganizationMutation} from 'hooks';
import {Currency, Organization} from '@prisma/client';

interface OrganizationForm {
  name: string | null;
  logoSrc: string | null;
  email: string | null;
  currency: Currency | null;
}

interface OrganizationSettingsProps {
  organization: Organization;
}

export function OrganizationSettings({
  organization,
}: OrganizationSettingsProps) {
  const createOrganization = useCreateOrganizationMutation();
  const form = useForm<OrganizationForm>({
    defaultValues: {
      name: organization.name || null,
      logoSrc: organization.logoSrc || null,
      email: organization.email || null,
      currency: organization.preferredCurrency || null,
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    const {name, logoSrc, email, currency} = data;

    if (name && logoSrc && email && currency) {
      try {
        await createOrganization.mutateAsync({logoSrc, name, email, currency});
      } catch (error) {}
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <CardBase>
        <form onSubmit={handleSubmit}>
          <FormProvider {...form}>
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                {...form.register('name', {
                  required: {
                    value: true,
                    message: 'Name is required',
                  },
                })}
                error={form.formState.errors.name}
                label="Name"
                data-testid="team-settings-form-input-name"
              />
              <Input
                type="email"
                {...form.register('email', {
                  required: {
                    value: true,
                    message: 'Email is required',
                  },
                })}
                error={form.formState.errors.email}
                label="Email"
                data-testid="team-settings-form-input-email"
              />
              <FileInput
                {...form.register('logoSrc', {
                  required: {
                    value: true,
                    message: 'Logo is required',
                  },
                })}
                error={form.formState.errors.logoSrc}
              />
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
              <div className="flex gap-2">
                <Button
                  type="submit"
                  isLoading={form.formState.isSubmitting}
                  data-testid="team-settings-form-input-submit-button"
                >
                  Save
                </Button>
              </div>
            </div>
          </FormProvider>
        </form>
      </CardBase>
      <TeamMembersSettings />
      <OrganizationSubscription />
      <StripeAccountLinkSettings type="BUSINESS" />
    </div>
  );
}
