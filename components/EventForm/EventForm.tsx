import {FormEventHandler} from 'react';
import {useFormContext} from 'react-hook-form';
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
      <CardBase>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="text-center">
              <Text className="text-2xl font-bold uppercase">
                {isEdit ? 'Edit event' : 'Create event'}
              </Text>
            </div>
            <div>
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
            </div>
            <div>
              <RichTextarea
                label="Event description"
                error={errors.description}
                {...register('description', {
                  required: {value: true, message: 'Description is required'},
                })}
              />
            </div>
            <div>
              <Input
                type="datetime-local"
                label="Event start date"
                error={errors.startDate}
                {...register('startDate', {
                  required: {value: true, message: 'Start date is required'},
                })}
              />
            </div>
            <div>
              <Input
                type="datetime-local"
                label="Event end date"
                error={errors.endDate}
                {...register('endDate', {
                  required: {value: true, message: 'End date is required'},
                })}
              />
            </div>
            <div>
              <LocationInput
                label="Event address"
                error={errors.address}
                {...register('address', {
                  required: {value: true, message: 'Address is required'},
                })}
              />
            </div>
            <div>
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
            <div>
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
            <div>
              <Button isLoading={isSubmitting} type="submit">
                Publish
              </Button>
            </div>
          </div>
        </form>
      </CardBase>
    </div>
  );
}
