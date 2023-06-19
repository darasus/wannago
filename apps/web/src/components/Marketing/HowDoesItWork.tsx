import {CardBase, Container, Text} from 'ui';
import {SectionHeader} from './SectionHeader';
import {SectionContainer} from './SectionContainer';
import {titleFontClassName} from '../../fonts';
import {cn} from 'utils';
import {ArrowRightIcon} from '@heroicons/react/24/outline';
import {Fragment} from 'react';
import {ArrowDownIcon} from '@heroicons/react/24/solid';

const items = [
  {
    summary: 'Create event',
    description:
      'Our user-friendly tools and features allow you to design an engaging and captivating event page swiftly. Add images, videos, and details to bring your event to life and entice attendees.',
  },
  {
    summary: 'Share event',
    description: `Spread the word about your event seamlessly! Share your expertly crafted event page across various social media platforms, emails, or even through direct messaging. Reach your target audience, grow your follower base, and increase your event's visibility. Facebook Events integration coming soon.`,
  },
  {
    summary: 'Manage event',
    description:
      'Stay on top of your event with our robust management features. Track ticket sales, respond to attendee queries, and update event details effortlessly. Gain insights and use this information to perfect your current and future events.',
  },
];

function Item({feature}: any) {
  return (
    <div className="w-full">
      <CardBase className="h-full" innerClassName="h-full">
        <div className="relative z-10 flex flex-col gap-1">
          <Text className={cn(titleFontClassName, 'font-display text-xl')}>
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
    <SectionContainer id="features">
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
                <>
                  <ArrowRightIcon className="hidden md:block shrink-0 w-12 h-1w-12" />
                  <ArrowDownIcon className="md:hidden shrink-0 w-12 h-1w-12" />
                </>
              )}
            </Fragment>
          ))}
        </div>
      </Container>
    </SectionContainer>
  );
}
