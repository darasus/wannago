import { CardBase, Container, Text } from "ui";
import { SectionHeader } from "./SectionHeader";
import {
  Building,
  CalendarDaysIcon,
  CameraIcon,
  Mail,
  MessageCircle,
  MoreHorizontal,
  TicketIcon,
  UserPlus,
} from "lucide-react";
import { SectionContainer } from "./SectionContainer";
import { titleFontClassName } from "../../fonts";
import { cn } from "utils";

const features = [
  {
    summary: "Profile page",
    description:
      "Let visitors easily connect with your business or subscribe to your events through beautiful profile pages.",
    icon: CalendarDaysIcon,
  },
  {
    summary: "Create",
    description:
      "Easily create a shareable event page with all the details your guests need to know.",
    icon: CalendarDaysIcon,
  },
  {
    summary: "Sell",
    description:
      "Experience hassle-free ticket sales. WannaGo ensures a smooth process for all.",
    icon: TicketIcon,
  },
  {
    summary: "Engage",
    description:
      "Streamlined organizer-to-guest engagement through personalized email invitations, event updates, and interactive RSVP.",
    icon: CameraIcon,
  },
  {
    summary: "Invite",
    description:
      "Whether it's your friends, family, coworkers or Twitter followers we let you choose who you want to invite.",
    icon: UserPlus,
  },
  {
    summary: "Attract",
    description:
      "You can upload photo, add relevant details with time and location or dress code and any special instructions all wrapped in a beautiful design.",
    icon: Building,
  },
  {
    summary: "Converse",
    description:
      "Send reminders, messages or announcements to your guests to make sure they don't miss out or let them ask questions.",
    icon: MessageCircle,
  },
  {
    summary: "Join",
    description: `Keep track of who is attending with our easy-to-use RSVPs. See at a glance who has confirmed and who's still on the fence.`,
    icon: Mail,
  },
  {
    summary: "More",
    description:
      "Explore WannaGo and let us know how we can improve your experience with us.",
    icon: MoreHorizontal,
  },
];

function Feature({ feature, className, ...props }: any) {
  return (
    <CardBase
      className={cn(className, "flex flex-col overflow-hidden h-full")}
      {...props}
    >
      <div className="relative z-10 flex flex-col gap-1">
        <Text className={cn(titleFontClassName, "font-display text-xl")}>
          {feature.summary}
        </Text>
        <Text className="text-sm text-gray-600">{feature.description}</Text>
      </div>
      <div
        className={cn(
          "absolute top-0 right-0 z-[0]",
          "w-[200px] h-[200px] flex items-center justify-center",
          "text-gray-100",
          "rotate-12"
        )}
      >
        <feature.icon w={100} h={100} />
      </div>
    </CardBase>
  );
}

export function Features() {
  return (
    <SectionContainer id="features">
      <Container>
        <SectionHeader
          title="Better experience"
          description="We provide the tools you need to build your audience and sell tickets while you focus on what's important"
        />
        <div className="grid lg:grid-cols-12 gap-4 items-stretch">
          {features.map((feature) => (
            <div key={feature.summary} className="col-span-4">
              <Feature feature={feature} className="mx-auto max-w-2xl" />
            </div>
          ))}
        </div>
      </Container>
    </SectionContainer>
  );
}
