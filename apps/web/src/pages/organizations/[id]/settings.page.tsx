import {useMyOrganizationQuery, useCreateOrganizationMutation} from 'hooks';
import {FormProvider, useForm} from 'react-hook-form';
import {Button, CardBase, Container, PageHeader, Toggle} from 'ui';
import {OrganizationSubscription} from './features/OrganizationSubscription/OrganizationSubscription';
import {TeamMembersSettings} from './features/TeamMemberSettings/TeamMembersSettings';
import {Currency} from '@prisma/client';
import {Input} from '../../../components/Input/Input/Input';
import {FileInput} from '../../../components/Input/FileInput/FileInput';
import {StripeAccountLinkSettings} from '../../settings/features/StripeAccountLinkSettings/StripeAccountLinkSettings';
import {withProtected} from '../../../utils/withAuthProtect';
import {ArrowLeftCircleIcon} from '@heroicons/react/24/solid';

// TODO: create description text explaining why you need to create a team

interface OrganizationForm {
  name: string | null;
  logoSrc: string | null;
  email: string | null;
  currency: Currency | null;
}

function OrganizationSettings() {
  const organization = useMyOrganizationQuery();
  const createOrganization = useCreateOrganizationMutation();
  const form = useForm<OrganizationForm>({
    defaultValues: {
      name: organization.data?.name || null,
      logoSrc: organization.data?.logoSrc || null,
      email: organization.data?.email || null,
      currency: organization.data?.preferredCurrency || null,
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
    <>
      <Container maxSize="sm">
        <div className="flex flex-col gap-4">
          <Button
            variant="neutral"
            iconLeft={<ArrowLeftCircleIcon />}
            href="/organizations"
            as="a"
          >
            Back to organizations
          </Button>
          <PageHeader title={`${organization.data?.name} settings`} />
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
        </div>
      </Container>
    </>
  );
}

export default withProtected(OrganizationSettings);
