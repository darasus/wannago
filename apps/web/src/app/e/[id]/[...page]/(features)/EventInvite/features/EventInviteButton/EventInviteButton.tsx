"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal } from "ui";
import { AdminInviteForm } from "../../../../../../../../types/forms";
import { toast } from "react-hot-toast";
import { Input } from "../../../../../../../../components/Input/Input/Input";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../../../../trpc/client";

export function EventInviteButton() {
  const [on, set] = useState(false);
  const params = useParams();
  const eventShortId = params?.id as string;
  const router = useRouter();

  const {
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting, errors },
  } = useForm<AdminInviteForm>();

  const onSubmit = handleSubmit(async (data) => {
    if (eventShortId) {
      await api.event.inviteByEmail
        .mutate({ ...data, eventShortId })
        .catch((error) => {
          toast.error(error.message);
        });
      toast.success("Invitation sent!");
      reset();
      set(false);
      router.refresh();
    }
  });

  return (
    <>
      <Modal title="Invite by email" isOpen={on} onClose={() => set(false)}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-12 gap-2 grow mr-2">
            <div className="col-span-6">
              <Input
                placeholder="First name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                error={errors.firstName}
                data-testid="invite-by-email-first-name-input"
              />
            </div>
            <div className="col-span-6">
              <Input
                placeholder="Last name"
                {...register("lastName", {
                  required: "Last name is required",
                })}
                error={errors.lastName}
                data-testid="invite-by-email-last-name-input"
              />
            </div>
            <div className="col-span-12">
              <Input
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                })}
                error={errors.email}
                data-testid="invite-by-email-email-input"
              />
            </div>
            <div className="col-span-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="w-full"
                data-testid="invite-by-email-submit-button"
              >
                Invite
              </Button>
            </div>
          </div>
        </form>
      </Modal>
      <Button
        size="sm"
        variant="outline"
        onClick={() => set(true)}
        data-testid="invite-by-email-open-modal-button"
      >
        Invite by email
      </Button>
    </>
  );
}
