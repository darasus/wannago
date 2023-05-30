import {CardBase, Text} from 'ui';

interface Props {
  numberOfAttendees: number;
  children: React.ReactNode;
}

export function SignUpCard({numberOfAttendees, children}: Props) {
  return (
    <CardBase>
      <div className="flex items-center gap-x-2">
        <div className="grow">
          <Text className="text-gray-400">{`${numberOfAttendees} attending`}</Text>
        </div>
        <div>{children}</div>
      </div>
    </CardBase>
  );
}
