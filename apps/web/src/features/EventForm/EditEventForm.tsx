"use client";

import { useRouter } from "next/navigation";
import { EventForm } from "./EventForm";
import { useEventForm } from "./hooks/useEventForm";
import { FormProvider } from "react-hook-form";
import { zonedTimeToUtc } from "date-fns-tz";
import { useAmplitudeAppDir } from "hooks";
import { PageHeader } from "ui";
import { Event, Organization, Ticket, User } from "@prisma/client";
import { api } from "../../trpc/client";

interface Props {
  event: Event & { tickets: Ticket[] };
  me: User;
  organization: Organization | null;
}

export function EditEventForm({ event, me, organization }: Props) {
  const { logEvent } = useAmplitudeAppDir();
  const router = useRouter();
  const form = useEventForm({
    event,
    me,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    logEvent("event_update_submitted");

    if (event?.id) {
      await api.event.update
        .mutate({
          ...data,
          tickets:
            data.tickets?.map((ticket) => ({
              ...ticket,
              price: Number(ticket.price) * 100,
              maxQuantity: Number(ticket.maxQuantity),
            })) || [],
          description: data.description === "<p></p>" ? null : data.description,
          eventId: event.id,
          startDate: zonedTimeToUtc(
            data.startDate,
            Intl.DateTimeFormat().resolvedOptions().timeZone
          ),
          endDate: zonedTimeToUtc(
            data.endDate,
            Intl.DateTimeFormat().resolvedOptions().timeZone
          ),
          maxNumberOfAttendees: data.maxNumberOfAttendees || 0,
        })
        .then((data) => {
          logEvent("event_updated", {
            eventId: data?.id,
          });
          router.push(`/e/${data.shortId}`);
        })
        .catch(() => {
          form.trigger();
        });
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Edit event" />
      <FormProvider {...form}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-12">
            <EventForm
              me={me}
              myOrganization={organization}
              onSubmit={onSubmit}
              onCancelClick={() => router.push(`/e/${event?.shortId}`)}
            />
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
