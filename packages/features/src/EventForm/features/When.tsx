import {useFormContext} from 'react-hook-form';
import {
  DateTimePicker,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'ui';
import {z} from 'zod';
import {eventFormSchema} from '../hooks/useEventForm';
import {getLocalTimeZone, parseAbsolute, today} from '@internationalized/date';

export function When() {
  const form = useFormContext<z.infer<typeof eventFormSchema>>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="startDate"
        render={({field}) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start date</FormLabel>
            <FormControl>
              <DateTimePicker
                aria-label="Start date"
                granularity={'minute'}
                value={
                  !!field.value
                    ? parseAbsolute(
                        field.value.toISOString(),
                        getLocalTimeZone()
                      )
                    : null
                }
                onChange={(value) => {
                  field.onChange(value.toDate('UTC'));
                }}
                data-testid="event-form-start-date"
                minValue={today(getLocalTimeZone())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="endDate"
        render={({field}) => (
          <FormItem className="flex flex-col">
            <FormLabel>End date</FormLabel>
            <FormControl>
              <DateTimePicker
                aria-label="End date"
                granularity={'minute'}
                value={
                  !!field.value
                    ? parseAbsolute(
                        field.value.toISOString(),
                        getLocalTimeZone()
                      )
                    : null
                }
                onChange={(value) => {
                  field.onChange(value.toDate('UTC'));
                }}
                data-testid="event-form-end-date"
                minValue={today(getLocalTimeZone())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
