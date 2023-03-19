import {useOrg} from 'hooks';
import {useForm} from 'react-hook-form';
import {Button, Modal} from 'ui';
import {Input} from '../../components/Input/Input/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Form {
  email: string;
}

export function CreateMemberModal({isOpen, onClose}: Props) {
  const {addMember} = useOrg();
  const form = useForm<Form>();

  const handleSubmit = form.handleSubmit(async data => {
    await addMember({email: data.email, role: 'admin'});
    onClose();
  });

  return (
    <Modal title="Add member" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Input type="email" {...form.register('email')} label="Email" />
          <div>
            <Button type="submit">Add</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
