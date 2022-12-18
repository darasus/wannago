import {FormEventHandler} from 'react';
import {useFormContext} from 'react-hook-form';
import {Badge} from '../Badge/Badge';
import {Button} from '../Button/Button';
import {CardBase} from '../Card/CardBase/CardBase';
import {FileInput} from '../Input/FileInput/FileInput';
import {Input} from '../Input/Input/Input';
import {LocationInput} from '../Input/LocationInput/LocationInput';
import {RichTextarea} from '../Input/RichTextarea/RichTextarea';
import {Text} from '../Text/Text';
import {Form} from './types';

interface Props {
  onSubmit: FormEventHandler;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function EventForm({onSubmit, isEdit}: Props) {
  const {
    register,
    formState: {isSubmitting, errors},
  } = useFormContext<Form>();

  return (
    <div>
      <CardBase className="p-8">
        <form onSubmit={onSubmit}>
          <div className="text-center pt-4 pb-8">
            <Text className="text-2xl font-bold uppercase">
              {isEdit ? 'Edit event' : 'Create event'}
            </Text>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="flex justify-end items-start col-span-4">
              <Badge color="gray">What</Badge>
            </div>
            <div className="flex flex-col col-span-8 gap-y-4">
              <Input
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
                label="Event description"
                error={errors.description}
                {...register('description', {
                  required: {value: true, message: 'Description is required'},
                })}
              />
              <FileInput
                label="Event image"
                error={errors.featuredImageSrc}
                {...register('featuredImageSrc', {
                  required: {
                    value: true,
                    message: 'Featured image is required',
                  },
                })}
              />
            </div>
            <div className="flex justify-end items-start col-span-4">
              <Badge color="gray">When</Badge>
            </div>
            <div className="flex flex-col col-span-8 gap-y-4">
              <Input
                type="datetime-local"
                label="Event start date"
                error={errors.startDate}
                {...register('startDate', {
                  required: {value: true, message: 'Start date is required'},
                })}
              />
              <Input
                type="datetime-local"
                label="Event end date"
                error={errors.endDate}
                {...register('endDate', {
                  required: {value: true, message: 'End date is required'},
                })}
              />
            </div>
            <div className="flex justify-end items-start col-span-4">
              <Badge color="gray">Where</Badge>
            </div>
            <div className="flex flex-col col-span-8 gap-y-4">
              <LocationInput
                label="Event address"
                error={errors.address}
                {...register('address', {
                  required: {value: true, message: 'Address is required'},
                })}
              />
            </div>
            <div className="flex justify-end items-start col-span-4">
              <Badge color="gray">Attend</Badge>
            </div>
            <div className="flex flex-col col-span-8 gap-y-4">
              <Input
                type="number"
                label="Max number of attendees"
                error={errors.maxNumberOfAttendees}
                {...register('maxNumberOfAttendees', {
                  required: {
                    value: true,
                    message: 'Max number of attendees is required',
                  },
                  min: {
                    value: 1,
                    message: 'Min number of attendees must be at least 1',
                  },
                  max: {
                    value: 1_000_000,
                    message:
                      'Max number of attendees must be not more that 1,000,000',
                  },
                })}
              />
            </div>
            <div className="flex justify-end items-start col-span-4" />
            <div className="flex justify-center col-span-8">
              <Button isLoading={isSubmitting} type="submit">
                Save as draft
              </Button>
            </div>
          </div>
        </form>
      </CardBase>
    </div>
  );
}
