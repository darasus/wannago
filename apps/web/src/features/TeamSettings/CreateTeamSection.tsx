import {useOrg} from 'hooks';
import {useForm} from 'react-hook-form';
import {Button, CardBase, Text} from 'ui';
import {Input} from '../../components/Input/Input/Input';

interface Form {
  name: string;
}

export function CreateTeamSection() {
  const {org, createOrg} = useOrg();
  const form = useForm<Form>();

  const handleSubmit = form.handleSubmit(async data => {
    await createOrg({name: data.name});
  });

  if (!org) {
    return (
      <CardBase>
        <div>
          <Text className="font-bold">Create team</Text>
          <div>{`You don't have any orgs yet`}</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Input type="text" {...form.register('name')} label="Team name" />
            <div>
              <Button type="submit">Create org</Button>
            </div>
          </div>
        </form>
      </CardBase>
    );
  }

  return null;
}
