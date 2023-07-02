import {useFormContext} from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Popover,
  PopoverTrigger,
  Spinner,
  Button,
  PopoverContent,
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  FormMessage,
} from 'ui';
import {z} from 'zod';
import {eventFormSchema} from '../hooks/useEventForm';
import {cn} from 'utils';
import {Check, ChevronsUpDown} from 'lucide-react';
import {useSearchLocation} from '../hooks/useSearchLocation';

export function Where() {
  const form = useFormContext<z.infer<typeof eventFormSchema>>();
  const searchLocation = useSearchLocation();

  return (
    <FormField
      control={form.control}
      name="address"
      render={({field}) => (
        <FormItem className="flex flex-col">
          <FormLabel>Location</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'justify-between',
                    !field.value && 'text-muted-foreground'
                  )}
                  data-testid="event-form-address-button"
                >
                  {field.value || 'Search location...'}
                  {searchLocation.isPending ? (
                    <Spinner />
                  ) : (
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput
                  placeholder="Search Location..."
                  value={searchLocation.value}
                  onValueChange={(value) => {
                    searchLocation.setValue(value);
                  }}
                  data-testid="event-form-address"
                />
                <CommandEmpty>No place found.</CommandEmpty>
                <CommandGroup>
                  {searchLocation.predictions?.map((location) => (
                    <CommandItem
                      value={location.description}
                      key={location.place_id}
                      onSelect={(value) => {
                        field.onChange(value);
                      }}
                      data-testid="location-input-option"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          location.description === field.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {location.description}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
