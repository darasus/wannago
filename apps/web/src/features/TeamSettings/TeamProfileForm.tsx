import {useCurrentOrganization} from 'hooks';
import {useCallback} from 'react';
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
  const {clerkOrganization, createOrg, removeOrg} = useCurrentOrganization();
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
    }
  });

  const handleRemove = useCallback(async () => {
    await removeOrg();
    form.reset();
  }, [removeOrg, form]);

  return (
    <CardBase>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            {...form.register('name', {
              required: {
                value: true,
                message: 'Name is required',
              },
            })}
            error={form.formState.errors.name}
            label="Name"
          />
          <Controller
            name="file"
            control={form.control}
            rules={{
              required: {
                value: true,
                message: 'Logo is required',
              },
            }}
            render={({field, formState: {errors}}) => {
              return (
                <ImageInput
                  onChange={file => {
                    field.onChange(file);
                  }}
                  defaultValue={clerkOrganization?.logoUrl}
                  error={errors.file}
                />
              );
            }}
          />
          <div className="flex gap-2">
            <Button type="submit" isLoading={form.formState.isSubmitting}>
              Save
            </Button>
            <Button onClick={handleRemove} variant="danger">
              Delete
            </Button>
          </div>
        </div>
      </form>
    </CardBase>
  );
}
