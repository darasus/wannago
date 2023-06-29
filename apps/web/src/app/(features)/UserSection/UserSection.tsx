"use client";

import { useAuth } from "@clerk/nextjs";
import { Popover, Transition } from "@headlessui/react";
import { Fragment, use } from "react";
import { Avatar, Button, CardBase } from "ui";
import { usePathname } from "next/navigation";
import { getIsPublic } from "../../../features/AppLayout/features/Header/constants";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { PlusCircle } from "lucide-react";

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

  return (
    <div className="flex gap-2">
      <Button
        className="flex md:hidden"
        onClick={() => router.push("/e/add")}
        data-testid="add-event-button-mini"
      >
        <PlusCircle />
      </Button>
      <Button
        className="hidden md:flex"
        onClick={() => router.push("/e/add")}
        data-testid="add-event-button"
      >
        <PlusCircle />
        Create event
      </Button>
      {me && (
        <Popover className="relative z-50">
          {() => (
            <>
              <Popover.Button as="div" data-testid="header-user-section-button">
                {() => {
                  return (
                    <Button variant="outline" data-testid="header-user-button">
                      <Avatar
                        className="h-6 w-6"
                        src={me.profileImageSrc}
                        alt={"avatar"}
                      />
                      {me.firstName}
                    </Button>
                  );
                }}
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 mt-3 max-w-sm">
                  {({ close }) => {
                    return (
                      <CardBase innerClassName="flex flex-col gap-y-2 w-40">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            router.push("/dashboard");
                            close();
                          }}
                        >
                          Dashboard
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid="profile-button"
                          onClick={() => {
                            router.push(`/u/${me.id}`);
                            close();
                          }}
                        >
                          Profile
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid="organizations-button"
                          onClick={() => {
                            router.push("/organizations");
                            close();
                          }}
                        >
                          Organizations
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            router.push("/settings");
                            close();
                          }}
                        >
                          Settings
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            router.push("/messages");
                            close();
                          }}
                          // TODO
                          // hasNotificationBadge={hasUnseenConversation}
                        >
                          Messages
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            onSignOutClick();
                            close();
                          }}
                          data-testid="logout-button"
                          size="sm"
                        >
                          Logout
                        </Button>
                      </CardBase>
                    );
                  }}
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      )}
    </div>
  );
}
