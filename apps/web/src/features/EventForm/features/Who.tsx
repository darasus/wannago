import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "ui";
import { z } from "zod";
import { eventFormSchema } from "../hooks/useEventForm";
import { Organization, User } from "@prisma/client";

interface Props {
  me: User;
  myOrganization?: Organization | null;
}

export function Who({ me, myOrganization }: Props) {
  const form = useFormContext<z.infer<typeof eventFormSchema>>();

  const options = [
    {
      label: `${me?.firstName} ${me?.lastName}`,
      value: `${me?.id}`,
    },
    ...(myOrganization
      ? [
          {
            label: `${myOrganization?.name}`,
            value: `${myOrganization?.id}`,
          },
        ]
      : []),
  ];

  return (
    <FormField
      control={form.control}
      name="createdById"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Created by</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
              }}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder="Select profile"
                  data-testid="event-form-created-by-input"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select profile</SelectLabel>
                  {options.map(({ label, value }) => {
                    return (
                      <SelectItem
                        key={value}
                        value={value}
                        data-testid={`created-by-option-${value}`}
                      >
                        {label}
                      </SelectItem>
                    );
                  })}
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
