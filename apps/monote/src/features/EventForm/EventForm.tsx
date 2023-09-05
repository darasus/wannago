'use client';

import {FormEventHandler} from 'react';
import {FormProvider, useFormContext} from 'react-hook-form';
import {Button, CardBase, Form} from 'ui';
import {Organization, User} from '@prisma/client';
import {z} from 'zod';
import {eventFormSchema} from './hooks/useEventForm';
import {Who} from './features/Who';
import {What} from './features/What';
import {When} from './features/When';
import {Where} from './features/Where';
import {Attend} from './features/Attend';

interface Props {
  onSubmit: FormEventHandler;
  isLoading?: boolean;
  onCancelClick: () => void;
  me: User;
  myOrganizations: Organization[];
}

export function EventForm({
  onSubmit,
  onCancelClick,
  me,
  myOrganizations,
}: Props) {
  const form = useFormContext<z.infer<typeof eventFormSchema>>();

  const items = [
    {
      label: 'Who',
      content: <Who me={me} myOrganizations={myOrganizations} />,
    },
    {
      label: 'What',
      content: <What />,
    },
    {
      label: 'When',
      content: <When />,
    },
    {
      label: 'Where',
      content: <Where />,
    },
    {
      label: 'Attend',
      content: <Attend />,
    },
  ];

  return (
    <>
      <div className="md:sticky md:top-4">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-y-4">
              <FormProvider {...form}>
                {items.map(({label, content}, i) => {
                  return (
                    <CardBase key={i} title={label}>
                      <div className="flex flex-col gap-y-2">{content}</div>
                    </CardBase>
                  );
                })}
              </FormProvider>
              <CardBase>
                <div className="flex gap-x-2">
                  <Button
                    disabled={form.formState.isSubmitting}
                    isLoading={form.formState.isSubmitting}
                    type="submit"
                    data-testid="event-form-submit-button"
                  >
                    {'Save'}
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      onCancelClick();
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </CardBase>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
