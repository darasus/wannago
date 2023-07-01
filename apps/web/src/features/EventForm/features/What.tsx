import {Sparkles, CheckCircle2} from 'lucide-react';
import {
  Button,
  FileInput,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
} from 'ui';
import {RichTextarea} from 'ui/src/components/RichTextarea/RichTextarea';
import {useFormContext} from 'react-hook-form';
import {eventFormSchema} from '../hooks/useEventForm';
import {z} from 'zod';
import {useGenerateEventDescription, useUploadImage} from 'hooks';
import {useCallback, useEffect} from 'react';

export function What() {
  const form = useFormContext<z.infer<typeof eventFormSchema>>();
  const {generate, generatedOutput, isLoading} = useGenerateEventDescription();
  const title = form.watch('title');
  const featuredImageSrc = form.watch('featuredImageSrc');

  const onClickGenerate = () => {
    generate(title);
  };

  useEffect(() => {
    if (generatedOutput) {
      form.setValue('description', generatedOutput);
    }
  }, [generatedOutput, form]);

  const {isLoading: isUploadingImage, handleFileUpload} = useUploadImage();

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file).then((data) => {
          if (data) {
            form.setValue('featuredImageSrc', data.url);
            form.setValue('featuredImageHeight', data.height);
            form.setValue('featuredImageWidth', data.width);
            form.setValue('featuredImagePreviewSrc', data.imageSrcBase64);
          }
        });
      }
    },
    [form, handleFileUpload]
  );

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
                isGenerating={isLoading}
                placeholder={`Type your description here or press "Generate" to let AI do the work for you...`}
                additionalEditorMenu={
                  <Button
                    size="sm"
                    onClick={onClickGenerate}
                    disabled={!title || title.length < 10 || isLoading}
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
              Featured image {isUploadingImage && <Spinner />}
              {!isUploadingImage && !!featuredImageSrc && (
                <CheckCircle2 className="w-3 h-3 text-green-600" />
              )}
            </FormLabel>
            <FormControl>
              <FileInput
                value={{src: field.value, height: null, width: null}}
                onChange={(value) => {
                  field.onChange(value?.src);
                  if (value?.height) {
                    form.setValue('featuredImageHeight', value?.height);
                  }
                  if (value?.width) {
                    form.setValue('featuredImageWidth', value?.width);
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
