'use client';

import {useState, useTransition} from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from 'ui';

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
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              data-testid="confirm-dialog-cancel-button"
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={onSubmit}
              disabled={isPending}
              isLoading={isPending}
              data-testid="confirm-dialog-confirm-button"
            >
              Confirm
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const open = () => setIsOpen(true);

  return {modal, open, isPending};
}
