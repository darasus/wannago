import Head from 'next/head';
import {Button, CardBase, Container} from 'ui';
import {withProtected} from '../../utils/withAuthProtect';
import {useForm} from 'react-hook-form';
import {Input} from '../../components/Input/Input/Input';
import {trpc} from 'trpc/src/trpc';
import {useRouter} from 'next/router';

function EventAddPage() {
  const router = useRouter();
  const form = useForm<{prompt: string}>();
  const createEventWithPrompt = trpc.event.createEventWithPrompt.useMutation();

  const handleSubmit = form.handleSubmit(async data => {
    const event = await createEventWithPrompt.mutateAsync({
      prompt: data.prompt,
    });

    router.push(`/e/${event.shortId}`);
  });

  return (
    <>
      <Head>
        <title>Add event | WannaGo</title>
      </Head>
      <Container maxSize="sm" className="md:px-4">
        <CardBase>
          <form onSubmit={handleSubmit}>
            <div className="flex items-end gap-2">
              <div className="grow">
                <Input
                  label="Describe your event"
                  type="text"
                  {...form.register('prompt')}
                  placeholder="Type here..."
                  disabled={createEventWithPrompt.isLoading}
                />
              </div>
              <Button type="submit" isLoading={form.formState.isSubmitting}>
                Create
              </Button>
            </div>
          </form>
        </CardBase>
      </Container>
    </>
  );
}

export default withProtected(EventAddPage);
