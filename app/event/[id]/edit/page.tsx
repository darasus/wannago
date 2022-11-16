'use client';

import {Card} from '../../../../components/Card/Card';
import {Input} from '../../../../components/Input/Input';
import {Textarea} from '../../../../components/Textarea/Textarea';
import {useForm} from '../../../../hooks/useForm';

export default function EventPage() {
  const {state, onTitleChange, onDescriptionChange} = useForm();

  return (
    <div>
      <Card>
        <div>
          <Input defaultValue={state?.title} onChange={onTitleChange} />
        </div>
        <div>
          <Textarea
            defaultValue={state?.description}
            onChange={onDescriptionChange}
          />
        </div>
        {JSON.stringify(state, null, 2)}
      </Card>
    </div>
  );
}
