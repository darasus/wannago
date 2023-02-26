import {FormEventHandler} from 'react';
import {Badge, CardBase} from 'ui';
import {JoinForm} from '../JoinForm/JoinForm';
import {Text, Tooltip} from 'ui';

interface Props {
  onSubmit: FormEventHandler;
  numberOfAttendees: string;
  isPublished: boolean;
}

export function ParticipantsCard({
  onSubmit,
  numberOfAttendees,
  isPublished,
}: Props) {
  const tooltipText = isPublished
    ? undefined
    : 'To enable sign-ups, please publish the event first.';

  return (
    <Tooltip text={tooltipText}>
      <CardBase isBlur={!isPublished}>
        <div>
          <div className="mb-2">
            <Badge color="gray" className="mr-2" size="xs">
              Attend
            </Badge>
            {/* <Button variant="link">Invite</Button> */}
          </div>
          <Text className="font-bold">Wanna go?</Text>
          <div className="mb-2" />
          <JoinForm onSubmit={onSubmit} />
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
            <Text className="text-gray-400">{numberOfAttendees}</Text>
          </div>
        </div>
      </CardBase>
    </Tooltip>
  );
}
