import {saveAs} from 'file-saver';
import {createEvent} from 'ics';
import {Event} from '@prisma/client';
import {prepareIcsData} from 'utils';
import {iOS} from 'utils';
import {DateCard as DataCardView} from 'cards';
import {Android} from 'utils';
import {useAmplitude} from 'hooks';

interface Props {
  event: Event;
}

export function DateCard({event}: Props) {
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
    />
  );
}
