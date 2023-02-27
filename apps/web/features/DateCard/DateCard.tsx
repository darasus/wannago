import {saveAs} from 'file-saver';
import {createEvent} from 'ics';
import {Event} from '@prisma/client';
import {prepareIcsData} from 'utils';
import {iOS} from 'utils';
import {DateCard as DataCardView} from '../../components/DateCard/DateCard';
import {Android} from 'utils';
import {useAmplitude} from '../../hooks/useAmplitude';

interface Props {
  event: Event;
  timezone?: string;
  relativeTimeString?: string;
}

export function DateCard({event, timezone, relativeTimeString}: Props) {
  const {logEvent} = useAmplitude();
  const handleCalendarClick = () => {
    logEvent('add_to_calendar_button_clicked', {
      eventId: event.id,
    });
    createEvent(prepareIcsData(event), (error, value) => {
      const blob = new Blob([value], {
        type: iOS() || Android() ? 'text/calendar' : 'text/plain;charset=utf-8',
      });
      saveAs(blob, 'event-schedule.ics');
    });
  };

  return (
    <DataCardView
      startDate={event.startDate}
      endDate={event.endDate}
      onAddToCalendarClick={handleCalendarClick}
      timezone={timezone}
      relativeTimeString={relativeTimeString}
    />
  );
}
