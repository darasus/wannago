import {useCallback, useEffect, useRef, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Event, Organization, User} from '@prisma/client';
import {InfoCard} from '../InfoCard/InfoCard';
import {LocationCard} from '../../features/LocationCard/LocationCard';
import {OrganizerCardView} from '../Card/OrganizerCard/OrganizerCardView';
import {DateCard} from '../../features/DateCard/DateCard';
import {ParticipantsCard} from '../../features/ParticipantsCard/ParticipantsCard';
import {EventUrlCard} from '../EventUrlCard/EventUrlCard';
import {getBaseUrl} from '../../utils/getBaseUrl';
import {Button} from '../Button/Button';
import {Container} from '../Container/Container';
import {SectionContainer} from './SectionContainer';
import {SectionHeader} from './SectionHeader';

const initial = {
  right: {x: 50, opacity: 0},
  left: {x: -50, opacity: 0},
};

const animate = {
  right: {x: 0, opacity: 1},
  left: {x: 0, opacity: 1},
};

const exit = {
  right: {x: -50, opacity: 0},
  left: {x: 50, opacity: 0},
};

const date = new Date();
const e: Event & {organization: Organization & {users: User[]}} = {
  id: '1',
  address: '12 Main Street, Brooklyn, NY, USA',
  createdAt: date,
  description:
    '<p>A <strong>Next Developer Conference</strong> is a multi-day event focused on the popular programming language used for web development. Attendees can expect to hear from expert speakers, learn about the latest trends and technologies in JavaScript, and network with other developers in the field. The conference may include a mix of keynote presentations, workshops, panel discussions, and networking opportunities. It is a great opportunity for attendees to improve their skills, learn from industry leaders, and stay up-to-date on the latest developments in the JavaScript world.</p>',
  endDate: new Date(date.setDate(date.getDate() + 2)),
  featuredImageSrc:
    'https://imagedelivery.net/1Y4KoCbQQUt_e_VWvskl5g/1c0f2504-5ef4-40ec-ffe4-49edde264300/public',
  isPublished: true,
  latitude: 40.703465,
  longitude: -73.99091299999999,
  maxNumberOfAttendees: 100,
  messageId: 'msg_7LseP1ssUr1FUyBQFgfE4esgb4wH',
  organizationId: '1cbc6ca8-26ac-4f0b-bf60-ff30045b55b7',
  shortId: 'yb0ap9',
  startDate: new Date(date.setDate(date.getDate() + 1)),
  title: 'Next Developer Conference',
  updatedAt: new Date(),
  organization: {
    id: '1cbc6ca8-26ac-4f0b-bf60-ff30045b55b7',
    users: [
      {
        id: '1cbc6ca8-26ac-4f0b-bf60-ff30045b55b7',
        firstName: 'Peter',
        lastName: 'Parker',
        email: 'hi@example.com',
        externalId: '1cbc6ca8-26ac-4f0b-bf60-ff30045b55b7',
        organizationId: '1cbc6ca8-26ac-4f0b-bf60-ff30045b55b7',
        profileImageSrc:
          'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250',
      },
    ],
  },
};

const events = [e, {...e, id: '2'}];

export default function EventSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [selectedEventIndex, selectEventIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const event = events[selectedEventIndex];

  useEffect(() => {
    setHeight(ref.current?.getBoundingClientRect().height);
  }, []);

  const elements = [
    <InfoCard key={1} event={event} />,
    <LocationCard
      key={2}
      address={event.address}
      longitude={event.longitude!}
      latitude={event.latitude!}
    />,
    <OrganizerCardView
      key={3}
      user={event.organization.users[0]}
      isLoading={false}
      onOpenFormClick={() => {}}
    />,
    <DateCard key={4} event={event} timezone={undefined} />,
    <ParticipantsCard key={5} event={event} fake />,
    <EventUrlCard key={6} url={`${getBaseUrl()}/e/${event.shortId}`} />,
  ];

  const hasNext = selectedEventIndex < events.length - 1;
  const hasPrev = selectedEventIndex > 0;

  const next = useCallback(() => {
    if (hasNext) {
      selectEventIndex(selectedEventIndex + 1);
    } else {
      selectEventIndex(0);
    }
  }, [selectedEventIndex, hasNext]);

  const prev = useCallback(() => {
    if (hasPrev) {
      selectEventIndex(selectedEventIndex - 1);
    } else {
      selectEventIndex(events.length - 1);
    }
  }, [selectedEventIndex, hasPrev]);

  return (
    <SectionContainer id="examples">
      <Container>
        <SectionHeader
          title="Examples of events"
          description="If you can't find what you're looking for, send us a"
        />
        <div className="flex justify-center overflow-hidden" style={{height}}>
          <AnimatePresence mode="wait">
            <motion.div
              key={event ? event.id : 'empty'}
              initial={initial[direction]}
              animate={animate[direction]}
              exit={exit[direction]}
              transition={{duration: 0.2}}
            >
              <div
                className="scale-50"
                ref={ref}
                style={{
                  maxWidth: 1024,
                  scale: 0.4,
                  transformOrigin: 'top center',
                }}
              >
                <div className="grid grid-cols-12 gap-4 pointer-events-none">
                  <div className="flex flex-col col-span-8 gap-y-4">
                    {elements.slice(0, 2).map((el, i) => {
                      return <div key={i}>{el}</div>;
                    })}
                  </div>
                  <div className="flex flex-col col-span-4 gap-y-4">
                    {elements.slice(2, 7).map((el, i) => {
                      return <div key={i}>{el}</div>;
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center mt-4 gap-x-4">
          <Button
            onClick={() => prev()}
            onMouseEnter={() => {
              setDirection('left');
            }}
          >
            Prev
          </Button>
          <Button
            onClick={() => next()}
            onMouseEnter={() => {
              setDirection('right');
            }}
          >
            Next
          </Button>
        </div>
      </Container>
    </SectionContainer>
  );
}
