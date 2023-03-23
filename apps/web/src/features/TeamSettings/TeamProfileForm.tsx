import {useCurrentOrganization} from 'hooks';
import {Controller, useForm} from 'react-hook-form';
import {Button, CardBase, Text} from 'ui';
import {ImageInput} from '../../components/Input/Input/ImageInput';
import {Input} from '../../components/Input/Input/Input';

//TODO: create description text explaining why you need to create a team

interface Form {
  name: string;
  file: File | null;
}

export function TeamProfileForm() {
  const {clerkOrganization, createOrg} = useCurrentOrganization();
  const form = useForm<Form>({
    defaultValues: {
      name: clerkOrganization?.name || '',
      file: null,
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    const {file, name} = data;

    if (file) {
      await createOrg({file, name});
      form.reset();
    }
  });

  return (
    <CardBase>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <Input type="text" {...form.register('name')} label="Name" />
          <Controller
            name="file"
            control={form.control}
            render={({field}) => {
              return (
                <ImageInput
                  onChange={file => {
                    field.onChange(file);
                  }}
                  defaultValue={clerkOrganization?.logoUrl}
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
