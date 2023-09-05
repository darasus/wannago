import {useFormContext} from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from 'ui';
import {z} from 'zod';
import {eventFormSchema} from '../hooks/useEventForm';
import {useSearchLocation} from '../hooks/useSearchLocation';

export function Where() {
  const form = useFormContext<z.infer<typeof eventFormSchema>>();
  const searchLocation = useSearchLocation();
  const currentValue = form.watch('address');
  const hasNoSearchResults =
    !searchLocation.predictions || searchLocation.predictions?.length === 0;

  return (
    <FormField
      control={form.control}
      name="address"
      render={({field}) => (
        <FormItem>
          <FormLabel>Address</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
              }}
            >
              <SelectTrigger data-testid="event-form-address-button">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <div className="relative">
                    <Input
                      className="mb-2"
                      placeholder="Type your address here..."
                      value={searchLocation.value}
                      onChange={(e) => {
                        searchLocation.setValue(e.target.value);
                      }}
                      data-testid="event-form-address-input"
                    />
                    {searchLocation?.isPending && (
                      <div className="absolute top-0 right-2 h-full flex items-center">
                        <Spinner className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  {Boolean(currentValue) && hasNoSearchResults && (
                    <SelectItem value={currentValue}>{currentValue}</SelectItem>
                  )}
                  {searchLocation.predictions?.map((location) => {
                    return (
                      <SelectItem
                        key={location.place_id}
                        value={location.description}
                        data-testid="location-input-option"
                      >
                        {location.description}
                      </SelectItem>
                    );
                  })}
                  {!Boolean(currentValue) && hasNoSearchResults && (
                    <div className="p-2 text-center">
                      <span>No location selected...</span>
                    </div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
