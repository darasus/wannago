import {Card, CardContent, CardHeader, ColoredBadge, Container} from 'ui';
import {SectionHeader} from './SectionHeader';
import {
  Building,
  CalendarDays,
  Camera,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Ticket,
  UserPlus,
} from 'lucide-react';
import {SectionContainer} from './SectionContainer';
import {cn} from 'utils';

const features = [
  {
    summary: 'Profile page',
    description:
      'Let visitors easily connect with your business or subscribe to your events through beautiful profile pages.',
    icon: CalendarDays,
  },
  {
    summary: 'Create',
    description:
      'Easily create a shareable event page with all the details your guests need to know.',
    icon: CalendarDays,
  },
  {
    summary: 'Sell',
    description:
      'Experience hassle-free ticket sales. WannaGo ensures a smooth process for all.',
    icon: Ticket,
  },
  {
    summary: 'Engage',
    description:
      'Streamlined organizer-to-guest engagement through personalized email invitations, event updates, and interactive RSVP.',
    icon: Camera,
  },
  {
    summary: 'Invite',
    description:
      "Whether it's your friends, family, coworkers or Twitter followers we let you choose who you want to invite.",
    icon: UserPlus,
  },
  {
    summary: 'Attract',
    description:
      'You can upload photo, add relevant details with time and location or dress code and any special instructions all wrapped in a beautiful design.',
    icon: Building,
  },
  {
    summary: 'Converse',
    description:
      "Send reminders, messages or announcements to your guests to make sure they don't miss out or let them ask questions.",
    icon: MessageCircle,
  },
  {
    summary: 'Join',
    description: `Keep track of who is attending with our easy-to-use RSVPs. See at a glance who has confirmed and who's still on the fence.`,
    icon: Mail,
  },
  {
    summary: 'More',
    description:
      'Explore WannaGo and let us know how we can improve your experience with us.',
    icon: MoreHorizontal,
  },
];

const colors = [
  'green',
  'red',
  'yellow',
  'blue',
  'purple',
  'teal',
  'pink',
  'orange',
  'lime',
] as const;

function Feature({feature, className, index, ...props}: any) {
  return (
    <Card
      className={cn(className, 'flex flex-col overflow-hidden h-full')}
      {...props}
    >
      <CardHeader className="items-start">
        <ColoredBadge color={colors[index]}>
          <feature.icon className="w-4 h-4" />
          {feature.summary}
        </ColoredBadge>
      </CardHeader>
      <CardContent>{feature.description}</CardContent>
    </Card>
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
          {features.map((feature, i) => (
            <div key={feature.summary} className="col-span-4">
              <Feature
                feature={feature}
                className="mx-auto max-w-2xl"
                index={i}
              />
            </div>
          ))}
        </div>
      </Container>
    </SectionContainer>
  );
}
