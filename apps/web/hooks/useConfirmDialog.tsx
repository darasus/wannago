import {useState} from 'react';
import {Button} from '../components/Button/Button';
import {Modal} from '../components/Modal/Modal';

interface Props {
  title: string;
  description: string;
  onConfirm: () => Promise<any>;
}

export function useConfirmDialog({title, description, onConfirm}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {}
    setIsOpen(false);
    setIsLoading(false);
  };

  const modal = (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
      <div className="mb-4">{description}</div>
      <div className="flex gap-x-2">
        <Button variant="neutral" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onSubmit} isLoading={isLoading}>
          Confirm
        </Button>
      </div>
    </Modal>
  );

  const open = () => setIsOpen(true);

  return {modal, open};
}
