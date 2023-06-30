"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "ui";
import { MessageParticipantsFormModal } from "./components/MessageParticipantsFormModal/MessageParticipantsFormModal";
import { useAmplitudeAppDir } from "hooks";
import { useParams } from "next/navigation";
import { api } from "../../../../../../../../trpc/client";

interface Form {
  subject: string;
  message: string;
}

export function MessageParticipantsButton() {
  const params = useParams();
  const eventShortId = params?.id as string;
  const { logEvent } = useAmplitudeAppDir();
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<Form>();

  const handleOnClick = () => {
    setIsOpen(true);
  };

  const handleOnSubmit = handleSubmit(async (data) => {
    if (eventShortId) {
      await api.mail.messageEventParticipants.mutate({ eventShortId, ...data });
      toast.success("Message is sent!", {
        duration: 10000,
      });
      setIsOpen(false);
      reset();
      logEvent("event_message_to_attendees_submitted", {
        eventId: eventShortId,
      });
    }
  });

  return (
    <>
      <MessageParticipantsFormModal
        isOpen={isOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsOpen(false)}
        onSubmit={handleOnSubmit}
        register={register}
      />
      <Button
        onClick={handleOnClick}
        size="sm"
        title="Message attendees"
        data-testid="message-attendees-button"
      >
        Message attendees
      </Button>
    </>
  );
}
