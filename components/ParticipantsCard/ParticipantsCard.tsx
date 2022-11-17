import {Avatar} from '../Avatar/Avatar';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Input} from '../Input/Input';
import {SectionTitle} from '../Text/SectionTitle';
import {Text} from '../Text/Text';

export function ParticipantsCard() {
  return (
    <>
      <Card>
        <div>
          <div className="mb-2">
            <SectionTitle color="green" className="mr-2">
              Attend
            </SectionTitle>
            <Button variant="link-neutral">Invite</Button>
          </div>
          <Text className="font-bold">Wanna go?</Text>
          <div className="mb-2" />
          <div className="flex">
            <div className="grow mr-2">
              <Input placeholder="Type your email here..." />
            </div>
            <Button>Join</Button>
          </div>
          <div className="border-b-2 border-dotted my-4" />
          <div className="flex">
            <Avatar
              images={[
                'https://source.unsplash.com/eyJhcHBfaWQiOjEyMDd9',
                'https://source.unsplash.com/eyJhcHBfaWQiOjEyMDd9',
                'https://source.unsplash.com/eyJhcHBfaWQiOjEyMDd9',
                'https://source.unsplash.com/eyJhcHBfaWQiOjEyMDd9',
                'https://source.unsplash.com/eyJhcHBfaWQiOjEyMDd9',
                'https://source.unsplash.com/eyJhcHBfaWQiOjEyMDd9',
                'https://source.unsplash.com/eyJhcHBfaWQiOjEyMDd9',
                'https://source.unsplash.com/eyJhcHBfaWQiOjEyMDd9',
                'https://source.unsplash.com/eyJhcHBfaWQiOjEyMDd9',
              ]}
            />
            <div className="grow" />
            <Text className="text-gray-400">{'1000+ people attending'}</Text>
          </div>
        </div>
      </Card>
    </>
  );
}
