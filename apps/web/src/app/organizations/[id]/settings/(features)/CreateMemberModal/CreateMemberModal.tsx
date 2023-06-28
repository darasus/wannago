'use client';

import {captureException} from '@sentry/nextjs';
import {useForm} from 'react-hook-form';
import {Button, Modal} from 'ui';
import {Input} from '../../../../../../components/Input/Input/Input';
import {Organization} from '@prisma/client';
import {api} from '../../../../../../trpc/client';
import {useLoadingToast} from 'hooks';

interface Props {
  isOpen: boolean;
  organization: Organization;
  onClose: () => void;
}

interface Form {
  email: string;
}

export function CreateMemberModal({isOpen, onClose, organization}: Props) {
  const form = useForm<Form>();

  const handleSubmit = form.handleSubmit(async data => {
    await api.organization.addOrganizationMember
      .mutate({
        userEmail: data.email,
        organizationId: organization.id,
      })
      .catch((error: any) => {
        captureException(error);
      });
    onClose();
  });

  useLoadingToast({isLoading: form.formState.isSubmitting});

  return (
    <Modal title="Add member" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Input type="email" {...form.register('email')} label="Email" />
          <div>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Add
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
