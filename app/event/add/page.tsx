'use client';

import {useUser} from '@clerk/nextjs';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {Button} from '../../../components/Button/Button';
import {Card} from '../../../components/Card/Card';
import {Input} from '../../../components/Input/Input';
import {Text} from '../../../components/Text/Text';
import {TextArea} from '../../../components/TextArea/TextArea';
import {zodResolver} from '@hookform/resolvers/zod';
import {CreateEventInput} from '../../../model';

interface Form {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  address: string;
  numberOfAttendees: number;
  featuredImage: string;
}

export default function AddEventPage() {
  const {push} = useRouter();
  const {user} = useUser();
  const {register, handleSubmit} = useForm<Form>({
    resolver: zodResolver(CreateEventInput),
  });

  const onSubmit = handleSubmit(async data => {
    const response = await fetch('/api/createEvent', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        email: user?.primaryEmailAddress?.emailAddress,
      }),
    }).then(res => res.json());

    push(`/event/${response.id}`);
  });

  return (
    <div>
      <Card>
        <form onSubmit={onSubmit}>
          <div className="mb-2">
            <Text className="text-2xl font-bold">Create event</Text>
          </div>
          <div className="mb-2">
            <Input
              type="file"
              label="Event title"
              {...register('featuredImage')}
            />
          </div>
          <div className="mb-2">
            <Input label="Event title" {...register('title')} />
          </div>
          <div className="mb-2">
            <TextArea label="Event description" {...register('description')} />
          </div>
          <div className="mb-2">
            <Input type="date" label="Event date" {...register('startDate')} />
            <Input type="date" label="Event date" {...register('endDate')} />
          </div>
          <div className="mb-2">
            <Input label="Event location" {...register('address')} />
          </div>
          <div className="mb-2">
            <Input
              type="number"
              label="Event date"
              {...register('numberOfAttendees')}
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
