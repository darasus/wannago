import {Container} from 'ui';
import {SectionHeader} from './SectionHeader';
import {
  UserGroupIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  ChatBubbleLeftEllipsisIcon,
  EnvelopeOpenIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import {SectionContainer} from './SectionContainer';
import {titleFontClassName} from '../../fonts';
import {cn} from '../../utils/cn';

const features = [
  {
    name: 'Events',
    summary: 'Create event page with ease',
    description:
      'With WannaGo, you can quickly and easily create a shareable event page with all the details your guests need to know.',
    icon: <CalendarDaysIcon width={25} height={25} />,
  },
  {
    name: 'Guests',
    summary: 'Invite only the guests you want',
    description:
      "Whether it's your friends, family, coworkers or Twitter followers we let you choose who you want to invite.",
    icon: <UserGroupIcon width={25} height={25} />,
  },
  {
    name: 'Looks',
    summary: 'Beautiful event page',
    description:
      'You can upload photo, add relevant details with time and location or dress code and any special instructions all wrapped in a beautiful design.',
    icon: <BuildingStorefrontIcon width={25} height={25} />,
  },
  {
    name: 'Comms',
    summary: 'Two-way chat',
    description:
      "Send reminders, messages or announcements to your guests to make sure they don't miss out or let them ask questions.",
    icon: <ChatBubbleLeftEllipsisIcon width={25} height={25} />,
  },
  {
    name: 'Invites',
    summary: 'Simple RSVPs',
    description:
      'Keep track of who is attending your event with our easy-to-use RSVP system. You can see at a glance who has confirmed their attendance and who is still on the fence.',
    icon: <EnvelopeOpenIcon width={25} height={25} />,
  },
  {
    name: 'Other',
    summary: 'And much more...',
    description:
      'Explore WannaGo and let us know how we can improve your experience with us.',
    icon: <EllipsisHorizontalIcon width={25} height={25} />,
  },
];

function Feature({feature, className, ...props}: any) {
  return (
    <div className={cn(className, 'flex flex-col items-center')} {...props}>
      <div
        className={cn(
          'w-12 h-12 rounded-full bg-brand-100 border-2 border-gray-800 flex items-center justify-center'
        )}
      >
        {feature.icon}
      </div>
      <h3 className={cn('mt-6 text-sm text-gray-400 uppercase')}>
        {feature.name}
      </h3>
      <p className={cn(titleFontClassName, 'mt-2 font-display text-xl')}>
        {feature.summary}
      </p>
      <p className="mt-4 text-sm text-gray-600 text-center">
        {feature.description}
      </p>
    </div>
  );
}

export function Features() {
  return (
    <SectionContainer id="features" className="bg-white">
      <Container className="my-0">
        <SectionHeader
          title="Easiest way to invite"
          description="We provide the tools you need to invite your network while you focus on what's important"
        />
        <div className="grid lg:grid-cols-12 gap-10">
          {features.map(feature => (
            <div key={feature.name} className="col-span-4">
              <Feature feature={feature} className="mx-auto max-w-2xl" />
            </div>
          ))}
        </div>
      </Container>
    </SectionContainer>
  );
}
