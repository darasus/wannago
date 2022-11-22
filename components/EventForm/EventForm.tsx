'use client';

import {FormEventHandler} from 'react';
import {UseFormRegister} from 'react-hook-form';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Input} from '../Input/Input';
import {Text} from '../Text/Text';
import {TextInput} from '../TextInput/TextInput';
import {Form} from './types';

interface Props {
  onSubmit: FormEventHandler;
  register: UseFormRegister<Form>;
}

export function EventForm({onSubmit, register}: Props) {
  return (
    <div>
      <Card>
        <form onSubmit={onSubmit}>
          <div className="text-center mb-2">
            <Text className="text-2xl font-bold">Create event</Text>
          </div>
          <div className="mb-2">
            <Input label="Event title" {...register('title')} />
          </div>
          <div className="mb-2">
            <TextInput label="Event description" {...register('description')} />
          </div>
          <div className="mb-2">
            <Input
              type="datetime-local"
              label="Event start date"
              {...register('startDate')}
            />
          </div>
          <div className="mb-2">
            <Input
              type="datetime-local"
              label="Event end date"
              {...register('endDate')}
            />
          </div>
          <div className="mb-2">
            <Input label="Event address" {...register('address')} />
          </div>
          <div className="mb-2">
            <Input
              type="number"
              label="Max number of attendees"
              {...register('maxNumberOfAttendees')}
            />
          </div>
          <div className="mb-2">
            <Input
              type="file"
              label="Event title"
              {...register('featuredImage')}
            />
          </div>
          <div>
            <Button type="submit">Publish</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
