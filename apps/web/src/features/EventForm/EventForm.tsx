"use client";

import { FormEventHandler } from "react";
import { FormProvider, useFormContext } from "react-hook-form";
import { Button, CardBase, Form } from "ui";
import { useLoadingToast } from "hooks";
import { Organization, User } from "@prisma/client";
import { z } from "zod";
import { eventFormSchema } from "./hooks/useEventForm";
import { Who } from "./features/Who";
import { What } from "./features/What";
import { When } from "./features/When";
import { Where } from "./features/Where";
import { Attend } from "./features/Attend";

interface Props {
  onSubmit: FormEventHandler;
  isLoading?: boolean;
  onCancelClick: () => void;
  me: User;
  myOrganization: Organization | null;
}

export function EventForm({
  onSubmit,
  onCancelClick,
  me,
  myOrganization,
}: Props) {
  const form = useFormContext<z.infer<typeof eventFormSchema>>();

  const items = [
    {
      label: "Who",
      content: <Who me={me} myOrganization={myOrganization} />,
    },
    {
      label: "What",
      content: <What />,
    },
    {
      label: "When",
      content: <When />,
    },
    {
      label: "Where",
      content: <Where />,
    },
    {
      label: "Attend",
      content: <Attend />,
    },
  ];

  useLoadingToast({ isLoading: form.formState.isSubmitting });

  return (
    <>
      <div className="md:sticky md:top-4">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-y-4">
              <FormProvider {...form}>
                {items.map(({ label, content }, i) => {
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
                    type="submit"
                    data-testid="event-form-submit-button"
                  >
                    {"Save"}
                  </Button>
                  <Button onClick={onCancelClick} variant="outline">
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
