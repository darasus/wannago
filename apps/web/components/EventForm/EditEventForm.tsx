import {Event, Organization, User} from '@prisma/client';
import {useRouter} from 'next/router';
import {EventForm} from './EventForm';
import {useEventForm} from './hooks/useEventForm';
import {FormProvider} from 'react-hook-form';
import {zonedTimeToUtc} from 'date-fns-tz';
import {trpc} from '../../utils/trpc';
import {useAmplitude} from '../../hooks/useAmplitude';
import {InfoCard} from '../InfoCard/InfoCard';
import {OrganizerCard} from '../OrganizerCard/OrganizerCard';
import {LocationCard} from '../LocationCard/LocationCard';
import {DateCard} from '../DateCard/DateCard';
import {TitleCard} from '../TitleCard/TitleCard';

interface Props {
  event: Event & {organization: (Organization & {users: User[]}) | null};
}

export function EditEventForm({event}: Props) {
  const {logEvent} = useAmplitude();
  const router = useRouter();
  const {push} = useRouter();
  const {mutateAsync} = trpc.event.update.useMutation({
    onSuccess: data => {
      logEvent('event_updated', {
        eventId: data?.id,
      });
      push(`/event/${data.id}`);
    },
  });
  const form = useEventForm({
    event,
  });

  const {handleSubmit, watch} = form;

  const onSubmit = handleSubmit(async data => {
    logEvent('event_update_submitted');
    await mutateAsync({
      ...data,
      eventId: event.id,
      startDate: zonedTimeToUtc(
        data.startDate,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      ),
      endDate: zonedTimeToUtc(
        data.endDate,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      ),
    });
  });

  const {
    address,
    description,
    endDate,
    featuredImageSrc,
    maxNumberOfAttendees,
    startDate,
    title,
  } = watch();

  const {data: geolocation} = trpc.maps.getGeolocation.useQuery({address});

  const updatedEvent: Event = {
    ...event,
    title,
    address,
    description,
    featuredImageSrc,
    maxNumberOfAttendees,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    longitude: geolocation?.results[0]?.geometry.location.lng || null,
    latitude: geolocation?.results[0]?.geometry.location.lat || null,
  };

  return (
    <FormProvider {...form}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <EventForm
            onSubmit={onSubmit}
            isEdit
            onCancelClick={() => router.push(`/event/${event.id}`)}
          />
        </div>
        <div className="col-span-8 pointer-events-none hidden md:block">
          <div className="flex flex-col gap-y-4">
            <TitleCard>Preview</TitleCard>
            <div>
              <OrganizerCard
                user={event.organization?.users[0]!}
                onOpenFormClick={() => {}}
              />
            </div>
            <div>
              <InfoCard
                title={updatedEvent.title}
                description={updatedEvent.description}
                featuredImageSrc={updatedEvent.featuredImageSrc}
              />
            </div>
            <div>
              <LocationCard
                address={updatedEvent.address}
                latitude={updatedEvent.latitude!}
                longitude={updatedEvent.longitude!}
                onGetDirectionsClick={() => {}}
              />
            </div>
            <div>
              <DateCard
                startDate={new Date(updatedEvent.startDate)}
                endDate={new Date(updatedEvent.endDate)}
                onAddToCalendarClick={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
