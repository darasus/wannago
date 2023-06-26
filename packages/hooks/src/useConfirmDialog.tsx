'use client';

import {useState, useTransition} from 'react';
import {Button, Modal} from 'ui';

interface Props {
  title: string;
  description: string;
  onConfirm: () => Promise<any>;
}

export function useConfirmDialog({title, description, onConfirm}: Props) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async () => {
    startTransition(async () => {
      try {
        await onConfirm();
      } catch (error) {}
      setIsOpen(false);
    });
  };

  const modal = (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
      <div className="mb-4">{description}</div>
      <div className="flex gap-x-2">
        <Button
          variant="neutral"
          onClick={() => setIsOpen(false)}
          data-testid="confirm-dialog-cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onSubmit}
          isLoading={isPending}
          data-testid="confirm-dialog-confirm-button"
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );

  const open = () => setIsOpen(true);

  return {modal, open, isPending};
}
