import {saveAs} from 'file-saver';
import {createEvent} from 'ics';
import {Event} from '@prisma/client';
import {prepareIcsData} from '../../utils/prepareIcsData';
import {iOS} from '../../utils/iOS';
import {DateCard as DataCardView} from '../../components/DateCard/DateCard';

interface Props {
  event: Event;
  timezone?: string;
}

export function DateCard({event, timezone}: Props) {
  const handleCalendarClick = () => {
    createEvent(prepareIcsData(event), (error, value) => {
      const blob = new Blob([value], {
        type: iOS() ? 'text/calendar' : 'text/plain;charset=utf-8',
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
    />
  );
}
