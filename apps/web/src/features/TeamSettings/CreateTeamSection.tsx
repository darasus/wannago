import {useCurrentOrganization} from 'hooks';
import {Controller, useForm} from 'react-hook-form';
import {Button, CardBase, Text} from 'ui';
import {ImageInput} from '../../components/Input/Input/ImageInput';
import {Input} from '../../components/Input/Input/Input';

interface Form {
  name: string;
  file: File;
}

export function CreateTeamSection() {
  const {clerkOrganization, createOrg} = useCurrentOrganization();
  const form = useForm<Form>();

  const handleSubmit = form.handleSubmit(async data => {
    await createOrg(data);
    form.reset();
  });

  if (!clerkOrganization) {
    return (
      <CardBase>
        <div className="mb-4">
          <Text className="font-bold">Create team</Text>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <Input type="text" {...form.register('name')} label="Name" />
            <Controller
              name="file"
              control={form.control}
              render={({field, formState}) => {
                return (
                  <ImageInput
                    onChange={file => {
                      field.onChange(file);
                    }}
                  />
                );
              }}
            />
            <div>
              <Button type="submit" isLoading={form.formState.isSubmitting}>
                Create
              </Button>
            </div>
          </div>
        </form>
      </CardBase>
    );
  }

  return null;
}

// create description text explaining why you need to create a team
