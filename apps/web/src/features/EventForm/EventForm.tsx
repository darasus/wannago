'use client';

import {FormEventHandler, useCallback, useEffect, useState} from 'react';
import {useFieldArray, useFormContext} from 'react-hook-form';
import {
  Badge,
  Button,
  CardBase,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectItem,
  Input,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  DateTimePicker,
} from 'ui';
import {RichTextarea} from '../../components/Input/RichTextarea/RichTextarea';
import {SparklesIcon} from '@heroicons/react/24/solid';
import {
  useGenerateEventDescription,
  useLoadingToast,
  useUploadImage,
} from 'hooks';
import {InputWrapper} from 'ui';
import {Textarea} from '../../components/Input/Input/Textarea';
import {Organization, User} from '@prisma/client';
import {z} from 'zod';
import {eventFormSchema} from './hooks/useEventForm';
import {cn} from 'utils';
import {ChevronsUpDown} from 'lucide-react';
import {useSearchLocation} from './hooks/useSearchLocation';
import {Check} from 'lucide-react';
import {parseAbsolute, getLocalTimeZone} from '@internationalized/date';

interface Props {
  onSubmit: FormEventHandler;
  isLoading?: boolean;
  isEdit?: boolean;
  onCancelClick: () => void;
  me: User;
  organization: Organization | null;
}

export function EventForm({
  onSubmit,
  isEdit,
  onCancelClick,
  me,
  organization,
}: Props) {
  const options = [
    {
      label: `${me?.firstName} ${me?.lastName}`,
      value: `${me?.id}`,
    },
    ...(organization
      ? [
          {
            label: `${organization?.name}`,
            value: `${organization?.id}`,
          },
        ]
      : []),
  ];

  const form = useFormContext<z.infer<typeof eventFormSchema>>();
  const {
    register,
    formState: {isSubmitting, errors, defaultValues},
    watch,
    setValue,
    control,
  } = form;
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'tickets',
  });
  const [attendType, setAttendType] = useState<'free' | 'paid'>(
    defaultValues?.tickets && defaultValues?.tickets?.length > 0
      ? 'paid'
      : 'free'
  );
  const {generate, generatedOutput, isLoading} = useGenerateEventDescription();
  const title = watch('title');
  const featuredImageSrc = watch('featuredImageSrc');
  const featuredImageWidth = watch('featuredImageWidth');
  const featuredImageHeight = watch('featuredImageHeight');

  console.log(watch());

  const onClickGenerate = () => {
    generate(title);
  };

  useEffect(() => {
    if (generatedOutput) {
      setValue('description', generatedOutput);
    }
  }, [generatedOutput, setValue]);

  useLoadingToast({
    isLoading,
    text: 'Generating event description...',
  });

  const searchLocation = useSearchLocation();

  const {isLoading: isUploadingImage, handleFileUpload} = useUploadImage();

  useLoadingToast({
    isLoading: isUploadingImage,
    text: 'Uploading image...',
  });

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file).then(data => {
          console.log({data});
          if (data) {
            form.setValue('featuredImageSrc', data.url);
            form.setValue('featuredImageHeight', data.height);
            form.setValue('featuredImageWidth', data.width);
            form.setValue('featuredImagePreviewSrc', data.imageSrcBase64);
          }
        });
      }
    },
    [form, handleFileUpload]
  );

  const items = [
    {
      label: <Badge variant="outline">Who</Badge>,
      content: (
        <>
          <FormField
            control={form.control}
            name="createdById"
            render={({field}) => (
              <FormItem>
                <FormLabel>Created by</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={value => {
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
                        {options.map(({label, value}) => {
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
        </>
      ),
    },
    {
      label: <Badge variant="outline">What</Badge>,
      content: (
        <>
          <FormField
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <RichTextarea
            dataTestId="event-form-description"
            label="Description"
            error={errors.description}
            isOptional
            isGenerating={isLoading}
            placeholder={`Type your description here or press "Generate" to let AI do the work for you...`}
            additionalEditorMenu={
              <Button
                size="sm"
                onClick={onClickGenerate}
                disabled={!title || title.length < 10 || isLoading}
              >
                <SparklesIcon /> Generate
              </Button>
            }
            {...register('description')}
          />
          <FormField
            control={form.control}
            name="featuredImageSrc"
            render={({field}) => (
              <FormItem>
                <FormLabel>Featured image</FormLabel>
                <FormControl>
                  <Input type="file" {...field} onChange={handleImageUpload} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isUploadingImage && <div>Uploading image...</div>}
          {/* {featuredImageSrc && (
            <Image
              src={featuredImageSrc}
              fill
              style={{objectFit: 'fill'}}
              alt="preview image"
            />
          )} */}
        </>
      ),
    },
    {
      label: <Badge variant="outline">When</Badge>,
      content: (
        <div className="grid grid-cols-2 gap-4">
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
                    onChange={value => {
                      field.onChange(value.toDate('UTC'));
                    }}
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
                    onChange={value => {
                      field.onChange(value.toDate('UTC'));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ),
    },
    {
      label: <Badge variant="outline">Where</Badge>,
      content: (
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
                    >
                      {field.value || 'Search location...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Location..."
                      value={searchLocation.value}
                      onValueChange={value => {
                        searchLocation.setValue(value);
                      }}
                    />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {searchLocation.result.data?.predictions.map(location => (
                        <CommandItem
                          value={location.description}
                          key={location.place_id}
                          onSelect={value => {
                            field.onChange(value);
                          }}
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
      ),
    },
    {
      label: (
        <>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Attend</Badge>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={attendType === 'free' ? 'default' : 'outline'}
                onClick={() => {
                  setAttendType('free');
                  fields.forEach((_, index) => {
                    remove(index);
                  });
                }}
              >
                Free
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setAttendType('paid');
                  setValue('maxNumberOfAttendees', 0);
                }}
                variant={attendType === 'paid' ? 'default' : 'outline'}
              >
                Paid
              </Button>
            </div>
          </div>
        </>
      ),
      content: (
        <div className="flex flex-col gap-2">
          {attendType === 'free' && (
            <FormField
              control={form.control}
              name="maxNumberOfAttendees"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Max number of attendees</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {attendType === 'paid' && (
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
                          placeholder={'Title'}
                          {...register(`tickets.${index}.title`)}
                        />
                        <Textarea
                          label="Description"
                          isOptional
                          {...register(`tickets.${index}.description`)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Price"
                            type="number"
                            {...register(`tickets.${index}.price`)}
                          />
                          <Input
                            placeholder="Max quantity"
                            type="number"
                            {...register(`tickets.${index}.maxQuantity`)}
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
                    maxQuantity: '0',
                    price: '0',
                    title: '',
                    id: '',
                  });
                }}
                variant="outline"
                size="sm"
              >
                Add another ticket
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  useLoadingToast({isLoading: isSubmitting});

  return (
    <>
      <div className="md:sticky md:top-4">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-y-4">
              {items.map(({label, content}, i) => {
                return (
                  <CardBase key={i}>
                    <div className="mb-2">{label}</div>
                    <div className="flex flex-col gap-y-2">{content}</div>
                  </CardBase>
                );
              })}
              <CardBase>
                <div className="flex gap-x-2">
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    data-testid="event-form-submit-button"
                  >
                    {isEdit ? 'Save' : 'Save as draft'}
                  </Button>
                  <Button onClick={onCancelClick} variant="outline">
                    Cancel
                  </Button>
                </div>
              </CardBase>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
