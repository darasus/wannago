import { useFieldArray, useFormContext } from "react-hook-form";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "ui";
import { z } from "zod";
import { eventFormSchema } from "../hooks/useEventForm";

export function Attend() {
  const form = useFormContext<z.infer<typeof eventFormSchema>>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tickets",
  });

  return (
    <Tabs
      defaultValue={
        form.formState.defaultValues?.tickets &&
        form.formState.defaultValues?.tickets?.length > 0
          ? "paid"
          : "free"
      }
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="free">Free</TabsTrigger>
        <TabsTrigger value="paid">Paid</TabsTrigger>
      </TabsList>
      <TabsContent value="free">
        <FormField
          control={form.control}
          name="maxNumberOfAttendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max number of attendees</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  data-testid="event-form-max-attendees"
                />
              </FormControl>
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
                        render={({ field }) => <Input {...field} />}
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
                        render={({ field }) => <Textarea {...field} />}
                      />
                    </FormControl>
                  </FormItem>
                  <div className="grid grid-cols-2 gap-2">
                    <FormItem>
                      <FormLabel className="flex gap-2 items-center">
                        Price
                      </FormLabel>
                      <FormControl key={field.id}>
                        <FormField
                          control={form.control}
                          name={`tickets.${index}.price`}
                          render={({ field }) => <Input {...field} />}
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
                          render={({ field }) => (
                            <Input type="number" {...field} />
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
                maxQuantity: "0",
                price: "0",
                title: "",
                id: "",
              });
            }}
            variant="outline"
            size="sm"
          >
            Add ticket
          </Button>
          <FormMessage />
        </>
      </TabsContent>
    </Tabs>
  );
}
