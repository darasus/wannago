import { CardBase, Container, Text } from "ui";
import { SectionHeader } from "./SectionHeader";
import { SectionContainer } from "./SectionContainer";
import { titleFontClassName } from "../../fonts";
import { cn } from "utils";
import { Fragment } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const items = [
  {
    summary: "Create event",
    description: `Create an engaging and captivating event page swiftly. Add featured image and details to bring your event to life and entice attendees.`,
  },
  {
    summary: "Share event",
    description: `Share your event page across various social media platforms, emails, or direct messages. Facebook Events integration coming soon.`,
  },
  {
    summary: "Manage event",
    description: `Track ticket sales, respond to attendee queries, and update event details effortlessly. Gain insights and use this information to perfect your current and future events.`,
  },
];

function Item({ feature }: any) {
  return (
    <div className="w-full">
      <CardBase className="h-full" innerClassName="h-full">
        <div className="relative z-10 flex flex-col gap-1">
          <Text className={cn(titleFontClassName, "font-display text-xl")}>
            {feature.summary}
          </Text>
          <Text className="text-sm text-gray-600">{feature.description}</Text>
        </div>
      </CardBase>
    </div>
  );
}

export function HowDoesItWork() {
  return (
    <SectionContainer id="how-does-it-work">
      <Container>
        <SectionHeader
          title="How does it work?"
          description={`Navigate your event's lifecycle seamlessly from creation to management, leveraging our intuitive tools to design captivating event pages, share them widely, and handle all aspects with insights for ultimate success.`}
        />
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-2">
          {items.map((feature, i) => (
            <Fragment key={feature.summary}>
              <Item feature={feature} />
              {items.length - 1 === i ? null : (
                <div className="flex items-center">
                  <ChevronRight className="hidden md:block shrink-0 w-12 h-1w-12" />
                  <ChevronDown className="md:hidden shrink-0 w-12 h-1w-12" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </Container>
    </SectionContainer>
  );
}
