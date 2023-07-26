import {
  FileInput,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'ui';
import {useFormContext} from 'react-hook-form';
import {eventFormSchema} from '../hooks/useEventForm';
import {z} from 'zod';
import dynamic from 'next/dynamic';

const DynamicRichTextarea = dynamic(() =>
  import('ui').then((mod) => mod.RichTextarea)
);

export function What() {
  const form = useFormContext<z.infer<typeof eventFormSchema>>();
  const featuredImageHeight = form.watch('featuredImageHeight');
  const featuredImageWidth = form.watch('featuredImageWidth');
  const featuredImagePreviewSrc = form.watch('featuredImagePreviewSrc');

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
              <DynamicRichTextarea
                dataTestId="event-form-description"
                value={field.value}
                onChange={field.onChange}
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
