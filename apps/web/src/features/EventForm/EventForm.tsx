'use client';

import {isBefore, isEqual} from 'date-fns';
import {FormEventHandler, useEffect, useState} from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import {Badge, Button, CardBase, Select, SelectItem} from 'ui';
import {FileInput} from '../../components/Input/FileInput/FileInput';
import {Input} from '../../components/Input/Input/Input';
import {LocationInput} from '../../components/Input/LocationInput/LocationInput';
import {RichTextarea} from '../../components/Input/RichTextarea/RichTextarea';
import {Form} from './types';
import {SparklesIcon} from '@heroicons/react/24/solid';
import {useGenerateEventDescription, useLoadingToast} from 'hooks';
import {InputWrapper} from 'ui';
import {Textarea} from '../../components/Input/Input/Textarea';
import {Organization, User} from '@prisma/client';

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

  const {
    register,
    formState: {isSubmitting, errors, defaultValues},
    watch,
    setValue,
    control,
  } = useFormContext<Form>();
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'tickets',
  });
  const [attendType, setAttendType] = useState<'free' | 'paid'>(
    defaultValues?.tickets && defaultValues?.tickets?.length > 0
      ? 'paid'
      : 'free'
  );
  // TODO: this casting is weird, figure out
  const startDate = useWatch<Form>({name: 'startDate'}) as string | null;
  const {generate, generatedOutput, isLoading} = useGenerateEventDescription();
  const title = watch('title');

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

  const items = [
    {
      label: <Badge variant="outline">Who</Badge>,
      content: (
        <Controller
          name="createdById"
          control={control}
          rules={{required: 'Create as is required'}}
          render={({field, formState}) => {
            return (
              <Select
                className="w-full"
                label="Create as"
                onSelectionChange={key => {
                  field.onChange(key);
                }}
                selectedKey={field.value}
                error={formState.errors.createdById}
                data-testid="event-form-created-by-input"
              >
                {options.map(option => (
                  <SelectItem
                    key={option.value}
                    data-testid={`created-by-option-${option.value}`}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            );
          }}
        />
      ),
    },
    {
      label: <Badge variant="outline">What</Badge>,
      content: (
        <>
          <Input
            data-testid="event-form-title"
            label="Event title"
            error={errors.title}
            {...register('title', {
              required: {
                value: true,
                message: 'Title is required',
              },
            })}
          />
          <RichTextarea
            dataTestId="event-form-description"
            label="Event description"
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
          <FileInput
            data-testid="event-form-image"
            label="Event image"
            error={errors.featuredImageSrc}
            isOptional
            {...register('featuredImageSrc')}
          />
        </>
      ),
    },
    {
      label: <Badge variant="outline">When</Badge>,
      content: (
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="datetime-local"
            label="Event start date"
            data-testid="event-form-start-date"
            error={errors.startDate}
            {...register('startDate', {
              required: {value: true, message: 'Start date is required'},
            })}
          />
          <Input
            type="datetime-local"
            label="Event end date"
            data-testid="event-form-end-date"
            error={errors.endDate}
            {...register('endDate', {
              required: {value: true, message: 'End date is required'},
              validate: (value: string) => {
                if (startDate) {
                  return isBefore(new Date(value), new Date(startDate)) ||
                    isEqual(new Date(value), new Date(startDate))
                    ? 'End date must be after start date'
                    : undefined;
                }
              },
            })}
          />
        </div>
      ),
    },
    {
      label: <Badge variant="outline">Where</Badge>,
      content: (
        <LocationInput
          label="Address"
          data-testid="event-form-address"
          error={errors.address}
          {...register('address', {
            required: {value: true, message: 'Address is required'},
          })}
        />
      ),
    },
    {
      label: (
        <>
          <div className="flex gap-2">
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
            <Input
              type="number"
              label="Max number of attendees"
              data-testid="event-form-max-attendees"
              error={errors.maxNumberOfAttendees}
              isOptional
              placeholder='Leave empty for "unlimited"'
              {...register('maxNumberOfAttendees')}
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
                          label={'Title'}
                          {...register(`tickets.${index}.title`)}
                        />
                        <Textarea
                          label="Description"
                          isOptional
                          {...register(`tickets.${index}.description`)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            label="Price"
                            type="number"
                            {...register(`tickets.${index}.price`)}
                          />
                          <Input
                            label="Max quantity"
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
      </div>
    </>
  );
}
