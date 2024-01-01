import {
  Card,
  CardContent,
  CardHeader,
  ColoredBadge,
  Container,
  Title,
} from 'ui';
import {SectionContainer} from './SectionContainer';
import {Fragment} from 'react';
import {
  ChevronDown,
  ChevronRight,
  PlusCircle,
  Settings2,
  Share2,
} from 'lucide-react';

const items = [
  {
    summary: 'Create event',
    description: `Create an engaging and captivating event page swiftly. Add featured image and details to bring your event to life and entice attendees.`,
    icon: PlusCircle,
  },
  {
    summary: 'Share event',
    description: `Share your event page across various social media platforms, emails, or direct messages. Facebook Events integration coming soon.`,
    icon: Share2,
  },
  {
    summary: 'Manage event',
    description: `Track ticket sales, respond to attendee queries, and update event details effortlessly. Gain insights and use this information to perfect your current and future events.`,
    icon: Settings2,
  },
];

function Item({feature}: any) {
  return (
    <div className="w-full">
      <Card className="h-full">
        <CardHeader className="items-start">
          <ColoredBadge color="default">
            <feature.icon className="w-4 h-4" />
            {feature.summary}
          </ColoredBadge>
        </CardHeader>
        <CardContent>{feature.description}</CardContent>
      </Card>
    </div>
  );
}

export function HowDoesItWork() {
  return (
    <SectionContainer id="how-does-it-work">
      <Container>
        <Title
          description={`Navigate your event's lifecycle seamlessly from creation to management, leveraging our intuitive tools to design captivating event pages, share them widely, and handle all aspects with insights for ultimate success.`}
        >
          How does it work?
        </Title>
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
