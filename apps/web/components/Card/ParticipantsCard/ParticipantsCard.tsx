import {Event} from '@prisma/client';
import {useForm} from 'react-hook-form';
import {Button} from '../../Button/Button';
import {CardBase} from '../CardBase/CardBase';
import {Input} from '../../Input/Input/Input';
import {Badge} from '../../Badge/Badge';
import {Text} from '../../Text/Text';
import {trpc} from '../../../utils/trpc';
import {toast} from 'react-hot-toast';

interface Form {
  email: string;
  firstName: string;
  lastName: string;
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
    formState: {isSubmitting, errors: formErrors},
    reset,
  } = useForm<Form>();
  const {mutateAsync, error} = trpc.event.join.useMutation({
    onError: error => {
      const validationErrors = (error.data?.zodError?.fieldErrors || {}) as any;
      Object.keys(validationErrors).forEach(key => {
        toast.error(validationErrors?.[key]);
      });
    },
    onSuccess: () => {
      toast.success('Successfully RSVPd, check your email for more details!');
    },
  });

  const onSubmit = handleSubmit(async data => {
    await mutateAsync({eventId: event.id, ...data});
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
              <Badge color="gray" className="mr-2">
                Attend
              </Badge>
              {/* <Button variant="link-neutral">Invite</Button> */}
            </div>
            <Text className="font-bold">Wanna go?</Text>
            <div className="mb-2" />
            <div className="flex">
              <div className="grid grid-cols-12 gap-2 grow mr-2">
                <div className="col-span-6">
                  <Input
                    placeholder="First name"
                    {...register('firstName', {
                      required: 'First name is required',
                    })}
                    error={formErrors.firstName}
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    placeholder="Last name"
                    {...register('lastName', {
                      required: 'Last name is required',
                    })}
                    error={formErrors.lastName}
                  />
                </div>
                <div className="col-span-8">
                  <Input
                    placeholder="Email"
                    {...register('email', {
                      required: 'Email is required',
                    })}
                    error={formErrors.email}
                  />
                </div>
                <div className="col-span-4">
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full"
                  >
                    Join
                  </Button>
                </div>
              </div>
            </div>
            <div className="border-b-2 border-dotted my-4" />
            <div className="flex">
              {/* <Avatar
                images={[
                  'https://source.unsplash.com/eyJhcHBfaWQiOjEyMDd9',
                  'https://source.unsplash.com/YzLMmxDTrvI',
                  'https://source.unsplash.com/6G6akT8biLg',
                ]}
              /> */}
              <div className="grow" />
              <Text className="text-gray-400">
                {typeof data?.count === 'number'
                  ? `${data?.count} people attending`
                  : 'Loading...'}
              </Text>
            </div>
          </div>
        </CardBase>
      </form>
    </>
  );
}
