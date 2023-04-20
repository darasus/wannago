import Head from 'next/head';
import {Button, CardBase, Container, LoadingBlock, PageHeader} from 'ui';
import {withProtected} from '../../utils/withAuthProtect';
import {useForm} from 'react-hook-form';
import {Input} from '../../components/Input/Input/Input';
import {useCreateEventMutation, usePreviewEventWithPromptMutation} from 'hooks';
import {EventView} from '../../features/EventView/EventView';
import {useRouter} from 'next/router';

function EventAddPage() {
  const router = useRouter();
  const form = useForm<{prompt: string}>({
    defaultValues: {
      prompt: '',
    },
  });
  const previewEventMutation = usePreviewEventWithPromptMutation();
  const createEventMutation = useCreateEventMutation();

  const handleSubmit = form.handleSubmit(async data => {
    try {
      await previewEventMutation.mutateAsync({
        prompt: data.prompt,
      });
    } catch (error) {}
  });

  const handleCreateEvent = async () => {
    if (previewEventMutation.data) {
      const response = await createEventMutation.mutateAsync({
        authorId: previewEventMutation.data.userId!,
        title: previewEventMutation.data.title,
        description: previewEventMutation.data.description,
        address: previewEventMutation.data.address,
        startDate: previewEventMutation.data.startDate,
        endDate: previewEventMutation.data.endDate,
        maxNumberOfAttendees: previewEventMutation.data.maxNumberOfAttendees,
        featuredImageSrc: previewEventMutation.data.featuredImageSrc,
        featuredImagePreviewSrc:
          previewEventMutation.data.featuredImagePreviewSrc,
        featuredImageHeight: previewEventMutation.data.featuredImageHeight,
        featuredImageWidth: previewEventMutation.data.featuredImageWidth,
        streamUrl: null,
      });

      router.push(`/e/${response.shortId}`);
    }
  };

  return (
    <>
      <Head>
        <title>Add event | WannaGo</title>
      </Head>
      <Container maxSize="sm" className="flex flex-col gap-4 md:px-4">
        <CardBase>
          <form onSubmit={handleSubmit}>
            <div className="flex items-end gap-2">
              <div className="grow">
                <Input
                  label="Describe your event"
                  type="text"
                  {...form.register('prompt')}
                  placeholder="Type what are willing to do, where and when..."
                  disabled={previewEventMutation.isLoading}
                  autoComplete="off"
                />
              </div>
              <Button type="submit" isLoading={form.formState.isSubmitting}>
                Create preview
              </Button>
            </div>
          </form>
        </CardBase>
        {previewEventMutation.isLoading && <LoadingBlock />}
        {previewEventMutation.data && (
          <>
            <PageHeader title="Preview event" />
            <div className="opacity-60 pointer-events-none">
              <EventView event={previewEventMutation.data} />
            </div>
            <Button
              onClick={handleCreateEvent}
              isLoading={createEventMutation.isLoading}
            >
              Create event
            </Button>
          </>
        )}
      </Container>
    </>
  );
}

export default withProtected(EventAddPage);
