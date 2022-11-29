import {FormEventHandler} from 'react';
import {useFormContext} from 'react-hook-form';
import {Button} from '../Button/Button';
import {Card} from '../DateCard/Card/Card';
import {FileInput} from '../FileInput/FileInput';
import {Input} from '../Input/Input';
import {LocationInput} from '../LocationInput/LocationInput';
import {Text} from '../Text/Text';
import {TextInput} from '../TextInput/TextInput';
import {Form} from './types';

interface Props {
  onSubmit: FormEventHandler;
  isLoading?: boolean;
}

export function EventForm({onSubmit}: Props) {
  const {
    register,
    formState: {isSubmitting},
  } = useFormContext<Form>();

  return (
    <div>
      <Card>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="text-center">
              <Text className="text-2xl font-bold uppercase">Create event</Text>
            </div>
            <div>
              <Input label="Event title" {...register('title')} />
            </div>
            <div>
              <TextInput
                label="Event description"
                {...register('description')}
              />
            </div>
            <div>
              <Input
                type="datetime-local"
                label="Event start date"
                {...register('startDate')}
              />
            </div>
            <div>
              <Input
                type="datetime-local"
                label="Event end date"
                {...register('endDate')}
              />
            </div>
            <div>
              <LocationInput label="Event address" {...register('address')} />
            </div>
            <div>
              <Input
                type="number"
                label="Max number of attendees"
                {...register('maxNumberOfAttendees')}
              />
            </div>
            <div>
              <FileInput
                label="Event image"
                {...register('featuredImageSrc')}
              />
            </div>
            <div>
              <Button isLoading={isSubmitting} type="submit">
                Publish
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
