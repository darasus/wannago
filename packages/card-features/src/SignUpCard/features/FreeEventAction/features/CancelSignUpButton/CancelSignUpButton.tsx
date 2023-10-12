import {useFormContext} from 'react-hook-form';
import {EventSignUpForm} from '../../types';
import {Button, Form} from 'ui';
import {Event} from '@prisma/client';
import {useCancelEvent} from './hooks/useCancelEvent';

interface Props {
  event: Event & {isPast: boolean};
}

export function CancelSignUpButton({event}: Props) {
  const form = useFormContext<EventSignUpForm>();
  const {cancelEvent, cancelModal} = useCancelEvent({event});
  const onCancelSubmit = form.handleSubmit(cancelEvent);

  return (
    <Form {...form}>
      {cancelModal}
      <form className="flex items-center gap-x-4" onSubmit={onCancelSubmit}>
        <div className="flex items-center gap-x-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || event.isPast}
            variant="outline"
            size="sm"
            data-testid="cancel-signup-button"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
