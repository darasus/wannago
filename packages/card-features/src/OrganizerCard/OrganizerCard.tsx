"use client";

import { Event, Organization, User } from "@prisma/client";
import { OrganizerCard as OrganizerCardView } from "cards";
import { useCreateConversation, useLoadingToast } from "hooks";
import { useRouter } from "next/navigation";
import { Button } from "ui";

interface Props {
  event: Event & {
    user: User | null;
    organization: Organization | null;
  };
  me: User | null;
  myOrganization: Organization | null;
}

export function OrganizerCard({ event, me, myOrganization }: Props) {
  const router = useRouter();
  const { createConversation, isMutating } = useCreateConversation({
    me,
    myOrganization,
  });

  const onMessageOrganizerClick = async () => {
    const conversation = await createConversation({
      organizationId: event?.organizationId,
      userId: event?.userId,
    });

    if (conversation) {
      router.push(`/messages/${conversation?.id}`);
    }
  };

  const organizerName = (
    event.user?.firstName
      ? `${event.user?.firstName} ${event.user?.lastName}`
      : event.organization?.name
  ) as string;

  const imageSrc = (event.user?.profileImageSrc ||
    event.organization?.logoSrc) as string;
  const profilePath = event.user?.id
    ? `/u/${event.user?.id}`
    : `/o/${event.organization?.id}`;

  useLoadingToast({ isLoading: isMutating });

  return (
    <OrganizerCardView
      name={organizerName}
      profileImageSrc={imageSrc?.includes("gravatar") ? null : imageSrc}
      profilePath={profilePath}
      action={
        <Button
          onClick={onMessageOrganizerClick}
          variant="link"
          size="sm"
          disabled={isMutating}
          className="p-0 h-auto"
        >
          Message organizer
        </Button>
      }
    />
  );
}
