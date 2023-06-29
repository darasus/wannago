import { useFieldArray, useFormContext } from "react-hook-form";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputWrapper,
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
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>
      <TabsContent value="paid">
        <>
          <InputWrapper label="Tickets">
            <div className="flex flex-col gap-2">
              {fields.map((field, index) => {
                return (
                  <div
                    className="flex flex-col border-2 border-gray-300 rounded-3xl gap-2 p-4"
                    key={field.id}
                  >
                    <Input
                      placeholder={"Title"}
                      {...form.register(`tickets.${index}.title`)}
                    />
                    <Textarea
                      placeholder="Description"
                      {...form.register(`tickets.${index}.description`)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Price"
                        type="number"
                        {...form.register(`tickets.${index}.price`)}
                      />
                      <Input
                        placeholder="Max quantity"
                        type="number"
                        {...form.register(`tickets.${index}.maxQuantity`)}
                      />
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
          </InputWrapper>
          <Button
            onClick={() => {
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
            Add another ticket
          </Button>
        </>
      </TabsContent>
    </Tabs>
  );
}
