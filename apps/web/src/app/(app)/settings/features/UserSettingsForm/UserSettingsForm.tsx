'use client';

import {FormProvider, useForm} from 'react-hook-form';
import {
  Button,
  CardBase,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
  Input,
} from 'ui';
import {FileInput} from 'ui';
import {Currency} from '@prisma/client';
import {type RouterOutputs} from 'api';
import {api} from '../../../../../trpc/client';
import {useRouter} from 'next/navigation';
import {z} from 'zod';
import {use} from 'react';
import {toast} from 'sonner';

const userProfileSettingsFormScheme = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  currency: z.nativeEnum(Currency),
  profileImageSrc: z.string(),
});

interface Props {
  userPromise: Promise<RouterOutputs['user']['me']>;
}

export function UserSettingsForm({userPromise}: Props) {
  const user = use(userPromise);
  const router = useRouter();
  const form = useForm<z.infer<typeof userProfileSettingsFormScheme>>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      profileImageSrc: user?.profileImageSrc || '',
      currency: user?.preferredCurrency || 'USD',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    if (user?.id) {
      await api.user.update
        .mutate({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          profileImageSrc: data.profileImageSrc,
          userId: user.id,
          currency: data.currency,
        })
        .then(() => {
          router.refresh();
          toast.success('User is updated!');
        })
        .catch((err) => {
          toast.error(err.message);
        });
      router.refresh();
    }
  });

  return (
    <FormProvider {...form}>
      <CardBase title="User details">
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({field}) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="first-name-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="last-name-input" />
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
                    <Input {...field} data-testid="email-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profileImageSrc"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <FileInput
                      value={
                        field.value
                          ? {
                              src: field.value,
                              height: 0,
                              width: 0,
                              imageSrcBase64: '',
                            }
                          : null
                      }
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
                      onValueChange={(value) => {
                        field.onChange(value as Currency);
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
            <div>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                isLoading={form.formState.isSubmitting}
                data-testid="user-settings-submit-button"
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </CardBase>
    </FormProvider>
  );
}
