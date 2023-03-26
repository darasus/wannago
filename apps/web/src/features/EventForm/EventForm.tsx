import {isBefore, isEqual} from 'date-fns';
import {FormEventHandler, useEffect} from 'react';
import {useFormContext, useWatch} from 'react-hook-form';
import {Badge, Button, CardBase} from 'ui';
import {FileInput} from '../../components/Input/FileInput/FileInput';
import {Input} from '../../components/Input/Input/Input';
import {LocationInput} from '../../components/Input/LocationInput/LocationInput';
import {RichTextarea} from '../../components/Input/RichTextarea/RichTextarea';
import {Form} from './types';
import {EventTypeToggleInput} from '../../components/Input/EventTypeToggleInput/EventTypeToggleInput';
import {
  VideoCameraIcon,
  BuildingOffice2Icon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import {useGenerateEventDescription} from 'hooks';

interface Props {
  onSubmit: FormEventHandler;
  isLoading?: boolean;
  isEdit?: boolean;
  onCancelClick: () => void;
}

export function EventForm({onSubmit, isEdit, onCancelClick}: Props) {
  const {
    register,
    formState: {isSubmitting, errors},
    watch,
    setValue,
  } = useFormContext<Form>();
  const startDate = useWatch<Form>({name: 'startDate'});
  const type = useWatch<Form>({name: 'type'});
  const {generate, generatedOutput, isLoading} = useGenerateEventDescription();
  const title = watch('title');

  const onClickGenerate = () => {
    generate(title);
  };

  useEffect(() => {
    setValue('description', generatedOutput);
  }, [generatedOutput, setValue]);

  const items = [
    {
      label: 'What',
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
            additionalEditorMenu={
              <Button
                size="xs"
                onClick={onClickGenerate}
                iconLeft={<SparklesIcon />}
                disabled={!title || title.length < 10}
                isLoading={isLoading}
              >
                Generate
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
      label: 'When',
      content: (
        <>
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
        </>
      ),
    },
    {
      label: 'Where',
      content: (
        <div className="flex gap-x-2 items-end relative">
          <div className="grow">
            {type === 'offline' && (
              <LocationInput
                label="Address"
                data-testid="event-form-address"
                error={errors.address}
                {...register('address', {
                  required: {value: true, message: 'Address is required'},
                })}
              />
            )}
            {type === 'online' && (
              <Input
                label="Stream URL"
                data-testid="event-form-url"
                error={errors.streamUrl}
                {...register('streamUrl', {
                  required: {value: true, message: 'Stream URL is required'},
                  validate: (value: string | undefined) => {
                    try {
                      if (value) {
                        new URL(value);
                      }
                    } catch (error) {
                      return 'Stream URL is not valid';
                    }
                    return undefined;
                  },
                })}
              />
            )}
          </div>
          <EventTypeToggleInput
            {...register('type')}
            data-testid="event-form-type"
            options={[
              {
                label: <BuildingOffice2Icon className="h-5 w-5" />,
                value: 'offline',
              },
              {
                label: <VideoCameraIcon className="h-5 w-5" />,
                value: 'online',
              },
            ]}
          />
        </div>
      ),
    },
    {
      label: 'Attend',
      content: (
        <>
          <Input
            type="number"
            label="Max number of attendees"
            data-testid="event-form-max-attendees"
            error={errors.maxNumberOfAttendees}
            isOptional
            {...register('maxNumberOfAttendees')}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <div className="md:sticky md:top-4">
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-y-4">
            {items.map(({label, content}, i) => {
              return (
                <CardBase key={i}>
                  <div className="mb-2">
                    <Badge color="gray" size="xs">
                      {label}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-y-2">{content}</div>
                </CardBase>
              );
            })}
            <CardBase>
              <div className="flex gap-x-2">
                <Button onClick={onCancelClick} variant="neutral">
                  Cancel
                </Button>
                <Button
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  type="submit"
                  data-testid="event-form-submit-button"
                >
                  {isEdit ? 'Save' : 'Save as draft'}
                </Button>
              </div>
            </CardBase>
          </div>
        </form>
      </div>
    </>
  );
}
