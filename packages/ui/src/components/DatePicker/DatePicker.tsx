'use client';

import * as React from 'react';
import {format} from 'date-fns';
import {Calendar as CalendarIcon} from 'lucide-react';
import {cn} from 'utils';
import {Button} from '../Button/Button';
import {Calendar, CalendarProps} from '../Calendar/Calendar';
import {Popover, PopoverContent, PopoverTrigger} from '../Popover/Popover';

interface Props {
  calendarProps: CalendarProps;
  selectedDate: Date;
}

export function DatePicker({selectedDate, calendarProps}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, 'PPP')
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar {...calendarProps} />
      </PopoverContent>
    </Popover>
  );
}
