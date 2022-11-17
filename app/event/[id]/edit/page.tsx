'use client';

import {useForm} from 'react-hook-form';
import {Button} from '../../../../components/Button/Button';
import {Card} from '../../../../components/Card/Card';
import {Input} from '../../../../components/Input/Input';
import {Text} from '../../../../components/Text/Text';
import {TextArea} from '../../../../components/Textarea/TextArea';

export default function EventPage() {
  const {register} = useForm();

  return (
    <div>
      <Card>
        <div className="mb-2">
          <Text className="text-2xl font-bold">Create event</Text>
        </div>
        <div className="mb-2">
          <Input label="Event title" {...register('title')} />
        </div>
        <div className="mb-2">
          <TextArea label="Event description" {...register('description')} />
        </div>
        <div className="mb-2">
          <Input type="date" label="Event date" {...register('date')} />
        </div>
        <div className="mb-2">
          <Input label="Event location" {...register('location')} />
        </div>
        <div className="mb-2">
          <Input type="number" label="Event date" {...register('attendees')} />
        </div>
        <div>
          <Button>Publish</Button>
        </div>
      </Card>
    </div>
  );
}
