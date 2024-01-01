'use client';

import {saveAs} from 'file-saver';
import {createEvent} from 'ics';
import {Event} from '@prisma/client';
import {prepareIcsData} from 'utils';
import {iOS} from 'utils';
import {Android} from 'utils';
import {useTracker} from 'hooks';
import {DateCardView} from './DateCardView';

interface Props {
  event: Event;
}

export function DateCard({event}: Props) {
  const {logEvent} = useTracker();
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
    <DateCardView
      startDate={event.startDate}
      endDate={event.endDate}
      onAddToCalendarClick={handleCalendarClick}
    />
  );
}
