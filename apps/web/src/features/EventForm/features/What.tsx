import {Sparkles} from 'lucide-react';
import {
  Button,
  FileInput,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'ui';
import {RichTextarea} from 'ui';
import {useFormContext} from 'react-hook-form';
import {eventFormSchema} from '../hooks/useEventForm';
import {z} from 'zod';
import {useEffect} from 'react';
import {useCompletion} from 'ai/react';

export function What() {
  const form = useFormContext<z.infer<typeof eventFormSchema>>();
  const {
    complete,
    completion,
    isLoading: isGenerating,
  } = useCompletion({
    api: '/api/ai/generate-event-description',
  });
  const title = form.watch('title');
  const featuredImageHeight = form.watch('featuredImageHeight');
  const featuredImageWidth = form.watch('featuredImageWidth');
  const featuredImagePreviewSrc = form.watch('featuredImagePreviewSrc');

  const onClickGenerate = () => {
    complete(title);
  };

  useEffect(() => {
    if (completion) {
      form.setValue('description', completion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completion]);

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({field}) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} data-testid="event-form-title" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({field}) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <RichTextarea
                dataTestId="event-form-description"
                label="Description"
                isOptional
                isGenerating={isGenerating}
                placeholder={`Type your description here or press "Generate" to let AI do the work for you...`}
                value={field.value}
                additionalEditorMenu={
                  <Button
                    size="sm"
                    onClick={onClickGenerate}
                    disabled={!title || title.length < 10 || isGenerating}
                    isLoading={isGenerating}
                  >
                    <Sparkles className="mr-2" /> Generate
                  </Button>
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="featuredImageSrc"
        render={({field}) => (
          <FormItem>
            <FormLabel className="flex gap-2 items-center">
              Featured image
            </FormLabel>
            <FormControl>
              <FileInput
                value={
                  field.value &&
                  featuredImageHeight &&
                  featuredImageWidth &&
                  featuredImagePreviewSrc
                    ? {
                        src: field.value,
                        height: featuredImageHeight,
                        width: featuredImageWidth,
                        imageSrcBase64: featuredImagePreviewSrc,
                      }
                    : null
                }
                onChange={(value) => {
                  console.log(value);
                  if (value) {
                    field.onChange(value.src);
                    form.setValue('featuredImageHeight', value.height);
                    form.setValue('featuredImageWidth', value.width);
                    form.setValue(
                      'featuredImagePreviewSrc',
                      value.imageSrcBase64
                    );
                  } else {
                    field.onChange(null);
                    form.setValue('featuredImageHeight', null);
                    form.setValue('featuredImageWidth', null);
                    form.setValue('featuredImagePreviewSrc', null);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
