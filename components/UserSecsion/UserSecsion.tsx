import {useUser} from '@clerk/nextjs';
import {Avatar} from '../Avatar/Avatar';
import {Text} from '../Text/Text';

export function UserSecsion() {
  const {user, isSignedIn} = useUser();

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex">
      <Avatar images={[user.profileImageUrl]} className="mr-2" />
      <Text>{`${user.firstName} ${user.lastName}`}</Text>
    </div>
  );
}
