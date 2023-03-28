import {
  useMyOrganizationQuery,
  useCreateOrganizationMutation,
  useRemoveOrganizationMutation,
  useConfirmDialog,
} from 'hooks';
import {useCallback} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {Button, CardBase, Text} from 'ui';
import {FileInput} from '../../components/Input/FileInput/FileInput';
import {Input} from '../../components/Input/Input/Input';
import {TeamMembersSettings} from './TeamMembersSettings';

// TODO: create description text explaining why you need to create a team

interface Form {
  name: string | null;
  logoSrc: string | null;
  email: string | null;
}

export function TeamSettings() {
  const organization = useMyOrganizationQuery();
  const createOrganization = useCreateOrganizationMutation();
  const removeOrganization = useRemoveOrganizationMutation();
  const form = useForm<Form>({
    defaultValues: {
      name: organization.data?.name || null,
      logoSrc: organization.data?.logoSrc || null,
      email: organization.data?.email || null,
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    const {name, logoSrc, email} = data;

    if (name && logoSrc && email) {
      await createOrganization.mutateAsync({logoSrc, name, email});
    }
  });

  const handleRemove = useCallback(async () => {
    if (organization?.data?.id) {
      await removeOrganization.mutateAsync({
        organizationId: organization.data.id,
      });
      form.setValue('name', null);
      form.setValue('email', null);
      form.setValue('logoSrc', null);
    }
  }, [removeOrganization, form, organization?.data?.id]);

  const {modal, open} = useConfirmDialog({
    title: 'Are you sure you want to remove your organization?',
    description: 'This action cannot be undone.',
    onConfirm: handleRemove,
  });

  return (
    <>
      {modal}
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
              <div className="flex gap-2">
                <Button
                  type="submit"
                  isLoading={form.formState.isSubmitting}
                  data-testid="team-settings-form-input-submit-button"
                >
                  Save
                </Button>
                {organization.data && (
                  <Button
                    onClick={open}
                    variant="danger"
                    data-testid="team-settings-remove-button"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </FormProvider>
        </form>
      </CardBase>
      <TeamMembersSettings />
    </>
  );
}
