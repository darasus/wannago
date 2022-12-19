import clsx from 'clsx';
import {Container} from '../Container/Container';
import {SecionHeader} from './SecionHeader';
import {
  UserGroupIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  ChatBubbleLeftEllipsisIcon,
  EnvelopeOpenIcon,
} from '@heroicons/react/24/outline';
import {SectionContainer} from './SectionContainer';
import {titleFontClassName} from '../../fonts';

const features = [
  {
    name: 'Events',
    summary: 'Create event page with ease',
    description:
      'With WannaGo, you can quickly and easily create a shareable event page and customize it with all the details your guests need to know.',
    icon: <CalendarDaysIcon width={25} height={25} />,
  },
  {
    name: 'Guests',
    summary: 'Invite only the guests you want',
    description:
      "Our platform allows you to invite only the people you want to attend your event, ensuring that it stays private, whether it's your friends, family or twitter following.",
    icon: <UserGroupIcon width={25} height={25} />,
  },
  {
    name: 'Branding',
    summary: 'Customizable event pages',
    description:
      'You can upload photo, add details about the date, time, and location of your event, and even include information about the dress code or any special instructions.',
    icon: <BuildingStorefrontIcon width={25} height={25} />,
  },
  {
    name: 'Comms',
    summary: 'Easy communication with guests',
    description:
      "Send reminders and messages to your guests to make sure they don't miss out on your event.",
    icon: <ChatBubbleLeftEllipsisIcon width={25} height={25} />,
  },
  {
    name: 'Invites',
    summary: 'RSVP tracking',
    description:
      'Keep track of who is attending your event with our easy-to-use RSVP system. You can see at a glance who has confirmed their attendance and who is still on the fence.',
    icon: <EnvelopeOpenIcon width={25} height={25} />,
  },
];

function Feature({feature, className, ...props}: any) {
  return (
    <div className={clsx(className, 'flex flex-col items-center')} {...props}>
      <div
        className={clsx(
          'w-12 h-12 rounded-full bg-brand-800 border-2 border-gray-700 flex items-center justify-center'
        )}
      >
        {feature.icon}
      </div>
      <h3 className={clsx('mt-6 text-sm text-gray-400 uppercase')}>
        {feature.name}
      </h3>
      <p
        className={clsx(
          titleFontClassName,
          'mt-2 font-display text-xl text-slate-800'
        )}
      >
        {feature.summary}
      </p>
      <p className="mt-4 text-sm text-slate-600 text-center">
        {feature.description}
      </p>
    </div>
  );
}

export function Features() {
  return (
    <SectionContainer id="features" className="bg-white">
      <Container className="my-0">
        <SecionHeader
          title="Easiest way to invite your network to your place"
          description="All you need to do is welcome your guests and we will take care of
            the rest."
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
