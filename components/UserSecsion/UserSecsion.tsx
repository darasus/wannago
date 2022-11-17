import {User} from '@clerk/nextjs/dist/api';
import {Avatar} from '../Avatar/Avatar';
import {Text} from '../Text/Text';

type Props = {user: User};

export function UserSecsion({user}: Props) {
  return (
    <div className="flex">
      <Avatar images={[user.profileImageUrl]} className="mr-2" />
      <Text>{`${user.firstName} ${user.lastName}`}</Text>
    </div>
  );
}
