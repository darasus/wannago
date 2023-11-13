import {useFieldArray, useFormContext} from 'react-hook-form';
import {
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from 'ui';
import {z} from 'zod';
import {eventFormSchema} from '../hooks/useEventForm';
import {getCurrencySymbol} from 'utils';

export function Attend() {
  const form = useFormContext<z.infer<typeof eventFormSchema>>();
  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: 'tickets',
  });

  return (
    <>
      <div className="space-y-2">
        <Label>Tickets</Label>
        <Tabs
          defaultValue={
            form.formState.defaultValues?.tickets &&
            form.formState.defaultValues?.tickets?.length > 0
              ? 'paid'
              : 'free'
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="free" data-testid="free-event-tab-button">
              Free
            </TabsTrigger>
            <TabsTrigger value="paid" data-testid="paid-event-tab-button">
              Paid
            </TabsTrigger>
          </TabsList>
          <TabsContent value="free">
            <FormField
              control={form.control}
              name="maxNumberOfAttendees"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Max number of attendees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      data-testid="event-form-max-attendees"
                    />
                  </FormControl>
                  <FormDescription>
                    Leave 0 for unlimited attendees
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="paid">
            <>
              <div className="flex flex-col gap-2 mb-2">
                {fields.map((field, index) => {
                  return (
                    <div
                      className="flex flex-col bg-muted rounded-md gap-2 p-4"
                      key={field.id}
                    >
                      <FormItem>
                        <FormLabel className="flex gap-2 items-center">
                          Ticket title
                        </FormLabel>
                        <FormControl key={field.id}>
                          <FormField
                            control={form.control}
                            name={`tickets.${index}.title`}
                            render={({field}) => (
                              <Input
                                {...field}
                                data-testid="ticket-title-input"
                              />
                            )}
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="flex gap-2 items-center">
                          Ticket description
                        </FormLabel>
                        <FormControl key={field.id}>
                          <FormField
                            control={form.control}
                            name={`tickets.${index}.description`}
                            render={({field}) => (
                              <Textarea
                                {...field}
                                data-testid="ticket-description-input"
                              />
                            )}
                          />
                        </FormControl>
                      </FormItem>
                      <div className="grid grid-cols-2 gap-2">
                        <FormItem>
                          <FormLabel className="flex gap-2 items-center">
                            {`Price, ${
                              form.formState.defaultValues?.currency
                                ? getCurrencySymbol(
                                    form.formState.defaultValues?.currency
                                  )
                                : null
                            }`}
                          </FormLabel>
                          <FormControl key={field.id}>
                            <FormField
                              control={form.control}
                              name={`tickets.${index}.price`}
                              render={({field}) => (
                                <Input
                                  {...field}
                                  data-testid="ticket-price-input"
                                />
                              )}
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem>
                          <FormLabel className="flex gap-2 items-center">
                            Max quantity
                          </FormLabel>
                          <FormControl key={field.id}>
                            <FormField
                              control={form.control}
                              name={`tickets.${index}.maxQuantity`}
                              render={({field}) => (
                                <Input
                                  type="number"
                                  {...field}
                                  data-testid="ticket-max-quantity-input"
                                />
                              )}
                            />
                          </FormControl>
                        </FormItem>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
              <Button
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  append({
                    maxQuantity: '0',
                    price: '0',
                    title: '',
                    id: '',
                  });
                }}
                variant="outline"
                size="sm"
                data-testid="add-ticket-button"
              >
                Add ticket
              </Button>
              <FormMessage />
            </>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
