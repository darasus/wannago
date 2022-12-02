import {Event} from '@prisma/client';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {trpc} from '../../../utils/trpc';
import {Avatar} from '../../Avatar/Avatar';
import {Button} from '../../Button/Button';
import {CardBase} from '../CardBase/CardBase';
import {Input} from '../../Input/Input/Input';
import {Badge} from '../../Badge/Badge';
import {Text} from '../../Text/Text';

interface Form {
  email: string;
}

interface Props {
  event: Event;
}

export function ParticipantsCard({event}: Props) {
  const {data, refetch} = trpc.event.getNumberOfAttendees.useQuery({
    eventId: event.id,
  });
  const {
    register,
    handleSubmit,
    formState: {isSubmitting},
    reset,
  } = useForm<Form>();
  const {mutateAsync, error} = trpc.event.rsvp.useMutation({
    onError: error => {
      const validationErrors = (error.data?.zodError?.fieldErrors || {}) as any;
      Object.keys(validationErrors).forEach(key => {
        toast.error(validationErrors?.[key]);
      });
    },
    onSuccess: () => {
      toast.success('Successfully RSVPd, check your email for more details!', {
        duration: 5000,
      });
    },
  });

  const onSubmit = handleSubmit(async data => {
    await mutateAsync({eventId: event.id, email: data.email});
    await refetch();
    reset();
  });

  const errors = Object.values(error?.data?.zodError?.fieldErrors || {})
    .map(v => v)
    .flat()
    .filter(Boolean) as string[];

  return (
    <>
      <form onSubmit={onSubmit}>
        <CardBase>
          <div>
            <div className="mb-2">
              <Badge color="purple" className="mr-2">
                Attend
              </Badge>
              {/* <Button variant="link-neutral">Invite</Button> */}
            </div>
            <Text className="font-bold">Wanna go?</Text>
            <div className="mb-2" />
            <div className="flex">
              <div className="grow mr-2">
                <Input
                  placeholder="Type your email here..."
                  {...register('email')}
                />
              </div>
              <Button type="submit" isLoading={isSubmitting}>
                Join
              </Button>
            </div>
            <div className="border-b-2 border-dotted my-4" />
            <div className="flex">
              <Avatar
                images={[
                  'https://source.unsplash.com/eyJhcHBfaWQiOjEyMDd9',
                  'https://source.unsplash.com/YzLMmxDTrvI',
                  'https://source.unsplash.com/6G6akT8biLg',
                ]}
              />
              <div className="grow" />
              {data && (
                <Text className="text-gray-400">{`${data?.count} people attending`}</Text>
              )}
            </div>
          </div>
        </CardBase>
      </form>
    </>
  );
}
