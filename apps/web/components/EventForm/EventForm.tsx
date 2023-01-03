import {FormEventHandler} from 'react';
import {useFormContext} from 'react-hook-form';
import {useBreakpoint} from '../../hooks/useBreakpoint';
import {Accordion} from '../Accordion/Accordion';
import {Badge} from '../Badge/Badge';
import {Button} from '../Button/Button';
import {CardBase} from '../CardBase/CardBase';
import {FileInput} from '../Input/FileInput/FileInput';
import {Input} from '../Input/Input/Input';
import {LocationInput} from '../Input/LocationInput/LocationInput';
import {RichTextarea} from '../Input/RichTextarea/RichTextarea';
import {Form} from './types';

interface Props {
  onSubmit: FormEventHandler;
  isLoading?: boolean;
  isEdit?: boolean;
  onCancelClick: () => void;
}

export function EventForm({onSubmit, isEdit, onCancelClick}: Props) {
  const isMobile = useBreakpoint('sm');
  const {
    register,
    formState: {isSubmitting, errors},
  } = useFormContext<Form>();

  const items = [
    {
      label: 'What',
      content: (
        <>
          <Input
            label="Event title"
            error={errors.title}
            {...register('title', {
              required: {
                value: true,
                message: 'Title is required',
              },
            })}
          />
          <RichTextarea
            label="Event description"
            error={errors.description}
            {...register('description', {
              required: {value: true, message: 'Description is required'},
            })}
          />
          <FileInput
            label="Event image"
            error={errors.featuredImageSrc}
            {...register('featuredImageSrc', {
              required: {
                value: true,
                message: 'Featured image is required',
              },
            })}
          />
        </>
      ),
    },
    {
      label: 'When',
      content: (
        <>
          <Input
            type="datetime-local"
            label="Event start date"
            error={errors.startDate}
            {...register('startDate', {
              required: {value: true, message: 'Start date is required'},
            })}
          />
          <Input
            type="datetime-local"
            label="Event end date"
            error={errors.endDate}
            {...register('endDate', {
              required: {value: true, message: 'End date is required'},
            })}
          />
        </>
      ),
    },
    {
      label: 'Where',
      content: (
        <>
          <LocationInput
            label="Event address"
            error={errors.address}
            {...register('address', {
              required: {value: true, message: 'Address is required'},
            })}
          />
        </>
      ),
    },
    {
      label: 'Attend',
      content: (
        <>
          <Input
            type="number"
            label="Max number of attendees"
            error={errors.maxNumberOfAttendees}
            {...register('maxNumberOfAttendees', {
              required: {
                value: true,
                message: 'Max number of attendees is required',
              },
              min: {
                value: 1,
                message: 'Min number of attendees must be at least 1',
              },
              max: {
                value: 1_000_000,
                message:
                  'Max number of attendees must be not more that 1,000,000',
              },
            })}
          />
        </>
      ),
    },
  ];

  return (
    <CardBase className="p-8 md:sticky md:top-4">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-y-4">
          {isMobile && isEdit ? (
            <Accordion items={items} defaultExpandedIndex={0} />
          ) : (
            <div className="flex flex-col gap-y-4">
              {items.map(({label, content}) => {
                return (
                  <div>
                    <div className="mb-2">
                      <Badge color="gray">{label}</Badge>
                    </div>
                    {content}
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex gap-x-2">
            <Button onClick={onCancelClick} variant="neutral">
              Cancel
            </Button>
            <Button isLoading={isSubmitting} type="submit">
              {isEdit ? 'Save' : 'Save as draft'}
            </Button>
          </div>
        </div>
      </form>
    </CardBase>
  );
}
