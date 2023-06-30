"use client";

import { useAuth } from "@clerk/nextjs";
import { use } from "react";
import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "ui";
import { usePathname } from "next/navigation";
import { getIsPublic } from "../../../features/AppLayout/features/Header/constants";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { cn } from "utils";

interface Props {
  mePromise: Promise<User | null>;
  hasUnseenConversationPromise: Promise<boolean>;
}

export function UserSection({
  mePromise,
  hasUnseenConversationPromise,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();
  const me = use(mePromise);
  // TODO
  const hasUnseenConversation = use(hasUnseenConversationPromise);
  const isPublicPage = getIsPublic(pathname ?? "/");

  const onSignOutClick = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (isPublicPage) {
    return (
      <div className="flex gap-2">
        <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
      </div>
    );
  }

  const options = [
    {
      label: "Dashboard",
      onClick: () => {
        router.push("/dashboard");
      },
    },
    {
      label: "Profile",
      onClick: () => {
        router.push(`/u/${me?.id}`);
      },
      "data-testid": "profile-button",
    },
    {
      label: "Organizations",
      onClick: () => {
        router.push(`/organizations`);
      },
      "data-testid": "organizations-button",
    },
    {
      label: "Settings",
      onClick: () => {
        router.push(`/settings`);
      },
    },
    {
      label: "Messages",
      onClick: () => {
        router.push(`/messages`);
      },
    },
    {
      label: "Logout",
      onClick: () => {
        onSignOutClick();
      },
      "data-testid": "logout-button",
    },
  ];

  return (
    <div className="flex gap-2">
      <Button
        className="flex md:hidden"
        onClick={() => router.push("/e/add")}
        data-testid="add-event-button-mini"
      >
        <PlusIcon />
      </Button>
      <Button
        className="hidden md:flex"
        onClick={() => router.push("/e/add")}
        data-testid="add-event-button"
      >
        <PlusIcon className="mr-2 w-4 h-4" />
        Create event
      </Button>
      {me && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" data-testid="header-user-button">
              <Avatar
                className="h-6 w-6 mr-2"
                src={me.profileImageSrc}
                alt={"avatar"}
              />
              {me.firstName}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {options.map(({ label, ...rest }) => {
                const isRed = label === "Logout";
                return (
                  <DropdownMenuItem key={label} {...rest}>
                    <span className={cn({ "text-red-500": isRed })}>
                      {label}
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
