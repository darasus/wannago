import {FormEventHandler} from 'react';
import {Badge} from '../Badge/Badge';
import {CardBase} from '../CardBase/CardBase';
import {JoinForm} from '../JoinForm/JoinForm';
import {Text} from '../Text/Text';

interface Props {
  onSubmit: FormEventHandler;
  numberOfAttendees: string;
}

export function ParticipantsCard({onSubmit, numberOfAttendees}: Props) {
  return (
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
  );
}
