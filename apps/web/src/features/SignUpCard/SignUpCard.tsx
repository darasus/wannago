import {Event} from '@prisma/client';
import {SignUpCard as _SignUpCard} from 'cards';
import {FormProvider, useForm} from 'react-hook-form';
import {Container} from 'ui';

interface EventSignUpForm {
  hasPlusOne: boolean;
}

interface Props {
  event: Event;
}

export function SignUpCard({event}: Props) {
  const form = useForm<EventSignUpForm>();

  return (
    <Container className="sticky bottom-4 w-full p-0 m-0">
      <FormProvider {...form}>
        <_SignUpCard
          onSubmit={() => {}}
          isPublished={event.isPublished}
          numberOfAttendees={event.maxNumberOfAttendees}
        />
      </FormProvider>
    </Container>
  );
}
