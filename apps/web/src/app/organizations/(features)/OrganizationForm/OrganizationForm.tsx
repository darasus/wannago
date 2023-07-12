'use client';

import {useRouter} from 'next/navigation';
import {useForm, FormProvider} from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  CardBase,
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
} from 'ui';
import {FileInput} from 'ui';
import {Currency, Organization} from '@prisma/client';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

const organizationSettingsFormScheme = z.object({
  name: z.string(),
  logoSrc: z.string().url('Logo is required'),
  email: z.string().email(),
  currency: z.nativeEnum(Currency),
});

interface Props {
  organization?: Organization;
  onSubmit: (
    args: z.infer<typeof organizationSettingsFormScheme>
  ) => Promise<Organization>;
}

export function OrganizationForm({organization, onSubmit}: Props) {
  const isCreating = !organization;
  const router = useRouter();
  const form = useForm<z.infer<typeof organizationSettingsFormScheme>>({
    resolver: zodResolver(organizationSettingsFormScheme),
    defaultValues: {
      name: organization?.name || '',
      logoSrc: organization?.logoSrc || '',
      email: organization?.email || '',
      currency: organization?.preferredCurrency || Currency.USD,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const {name, logoSrc, email, currency} = data;

    if (name && logoSrc && email && currency) {
      try {
        await onSubmit({logoSrc, name, email, currency})
          .then((res) => {
            toast.success(
              isCreating
                ? 'Organization is created!'
                : 'Organization settings updated!'
            );
            if (isCreating) {
              router.push(`/organizations/${res.id}/settings`);
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
        router.refresh();
      } catch (error) {}
    }
  });

  return (
    <CardBase title="Organization details">
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <FormProvider {...form}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Business name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        data-testid="team-settings-form-input-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        data-testid="team-settings-form-input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logoSrc"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Profile picture</FormLabel>
                    <FormControl>
                      <FileInput
                        value={{src: field.value, height: null, width: null}}
                        onChange={(value) => {
                          field.onChange(value?.src || '');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Preferred currency</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(e) => {
                          field.onChange(e as Currency);
                        }}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="USD" />
                          </FormControl>
                          <FormLabel className="font-normal">USD</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="EUR" />
                          </FormControl>
                          <FormLabel className="font-normal">EUR</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="GBP" />
                          </FormControl>
                          <FormLabel className="font-normal">GBP</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  isLoading={form.formState.isSubmitting}
                  data-testid="team-settings-form-input-submit-button"
                >
                  Save
                </Button>
              </div>
            </div>
          </FormProvider>
        </form>
      </Form>
    </CardBase>
  );
}
