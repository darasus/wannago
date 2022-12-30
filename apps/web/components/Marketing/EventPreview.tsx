import {Event, Organization, User} from '@prisma/client';
import {useRef, useState, useLayoutEffect} from 'react';
import {getBaseUrl} from '../../utils/getBaseUrl';
import {DateCard} from '../Card/DateCard/DateCard';
import {EventUrlCard} from '../Card/EventUrlCard/EventUrlCard';
import {InfoCard} from '../Card/InfoCard/InfoCard';
import {LocationCard} from '../Card/LocationCard/LocationCard';
import {OrganizerCardView} from '../Card/OrganizerCard/OrganizerCardView';
import {ParticipantsCard} from '../Card/ParticipantsCard/ParticipantsCard';
import {AnimateRender} from './AnimateRender';

const date = new Date();

const event: Event & {organization: Organization & {users: User[]}} = {
  address: '12 Main Street, Brooklyn, NY, USA',
  createdAt: date,
  description:
    '<p>A <strong>Next Developer Conference</strong> is a multi-day event focused on the popular programming language used for web development. Attendees can expect to hear from expert speakers, learn about the latest trends and technologies in JavaScript, and network with other developers in the field. The conference may include a mix of keynote presentations, workshops, panel discussions, and networking opportunities. It is a great opportunity for attendees to improve their skills, learn from industry leaders, and stay up-to-date on the latest developments in the JavaScript world.</p><h3>Agenda</h3><ul><li><p><strong>6:00 PM:</strong> Doors open, attendees arrive and network</p></li><li><p><strong>6:30 PM:</strong> Welcome and introductions</p></li><li><p><strong>6:40 PM:</strong> Keynote presentation by a guest speaker on a relevant topic in JavaScript development</p></li><li><p><strong>7:10 PM:</strong> Breakout sessions, where attendees can choose from a variety of talks and workshops on topics such as React, Node.js, and testing</p></li><li><p><strong>8:30 PM:</strong> Closing remarks and announcements</p></li><li><p><strong>9:00 PM:</strong> End of event, attendees are welcome to continue networking or head home.</p></li></ul>',
  endDate: new Date(date.setDate(date.getDate() + 2)),
  featuredImageSrc:
    'https://imagedelivery.net/1Y4KoCbQQUt_e_VWvskl5g/1c0f2504-5ef4-40ec-ffe4-49edde264300/public',
  id: '1207035d-0393-4f5d-a802-90dfae9d49d9',
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

export default function EventPreview() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number | null>(null);
  const canRenderPreview = scale !== null && scale > 0;

  useLayoutEffect(() => {
    const el = ref.current?.getBoundingClientRect();
    const containerWidth = el?.width || 1024;
    const scale = containerWidth / 1024;

    setScale(scale);
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

  return (
    <div ref={ref} className="h-full w-full">
      <div
        style={{
          minWidth: 1024,
          scale: `${scale}`,
          transformOrigin: 'top left',
        }}
      >
        {canRenderPreview && (
          <div className="grid grid-cols-12 gap-4">
            <div className="flex flex-col col-span-8 gap-y-4">
              {elements.slice(0, 1).map((el, i) => {
                return (
                  <AnimateRender key={i}>
                    <div>{el}</div>
                  </AnimateRender>
                );
              })}
            </div>
            <div className="flex flex-col col-span-4 gap-y-4">
              {elements.slice(2, 7).map((el, i) => {
                return (
                  <AnimateRender key={i} delay={(i + 1) / 2}>
                    <div>{el}</div>
                  </AnimateRender>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}